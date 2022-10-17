
<template>
  <v-card>
    <v-card-title>Graph Explorer</v-card-title>
    <v-card-text>
      <div id="sigma-container" class="full-height" style="height: 800px; width: 100%"></div>
    </v-card-text>
    <v-overlay absolute :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
/* eslint-disable */
import axios from "axios"

import Sigma from "sigma"
import { aql, Database } from "arangojs"
import Graph from "graphology"
import { circular } from "graphology-layout"
import forceAtlas2 from "graphology-layout-forceatlas2"

export default {
  name: "Graph",
  data: function() {
    return {
      filter: null,
      current: null,
      overlay: true,
      token: "",
      graph: false,
      sigma: false,
      vertexes: {},
      edges: {}
    }
  },
  watch: {
    "vertexes.local_binfile": function() {
      console.log("change")
    }
  },
  props: {
    msg: String
  },
  created: async function() {
    this.db = new Database({
      url: "http://135.181.254.40:8529",
      databaseName: "oniro-test1",
      auth: { username: "dashboard", password: "dashboard" }
    })

    const collections = await this.db.listCollections(false)
    const graph = this.db.graph("test")

    const graphEdgeCollections = await graph.edgeCollections()
    for (const collection of graphEdgeCollections) {
      const coll = await this.fetchCollection(collection, true)
    }

    const graphVertexCollections = await graph.vertexCollections()
    for (const collection of graphVertexCollections) {
      const coll = await this.fetchCollection(collection)
    }

    console.log(this.vertexes)
    console.log(this.edges)

    this.graph = new Graph()

    this.draw()
  },
  methods: {
    async fetchCollection(collection, edges = false) {
      try {
        const entries = await this.db.query(aql`
                              FOR e IN ${collection} LIMIT 99999
                              RETURN e 
                              `)

        for await (const entry of entries) {
          if (!edges) {
            if (typeof this.vertexes[collection.name] == "undefined")
              this.vertexes[collection.name] = []
            this.vertexes[collection.name].push(entry)
          } else {
            if (typeof this.edges[collection.name] == "undefined") this.edges[collection.name] = []
            this.edges[collection.name].push(entry)
          }
        }
      } catch (err) {
        console.error(err.message)
      }
    },
    async getData() {
      this.overlay = true

      const config = {
        headers: { Authorization: `Bearer ${this.token}` }
      }

      let body = {
        query: "FOR p IN elf RETURN p",
        count: true,
        batchSize: 5000
      }

      var res = await axios.post("http://135.181.254.40:8529/_api/cursor", body, config)
      this.vertexes.elf = res.data.result

      var query = this.current
        ? "FOR c IN elf FILTER c.name == '" +
          this.current.name +
          "' FOR v IN 1..9999 OUTBOUND c linkswith RETURN {v, c}"
        : "FOR c IN elf FOR v IN 1..9999 OUTBOUND c linkswith RETURN {v, c}"

      body = {
        query: query,
        count: true,
        batchSize: 50000
      }

      var dependencies = await axios.post("http://135.181.254.40:8529/_api/cursor", body, config)
      this.dependencies = dependencies.data.result

      this.draw()
    },
    draw: function() {
      this.graph.clear()
      this.graph = new Graph()

      this.vertexes["local_binfile"].forEach(line => {
        console.log(line)

        if (!this.graph.hasNode(line._id))
          this.graph.addNode(line._id, {
            nodeType: "binary",
            label: line.label
          })
      })

      this.vertexes["local_srcfile"].forEach(line => {
        console.log(line)

        if (!this.graph.hasNode(line._id))
          this.graph.addNode(line._id, {
            nodeType: "sourcefile",
            label: line.label
          })
      })

      this.edges["generated_from"].forEach(line => {
        console.log(line)
        if (!this.graph.hasEdge(line._id)) this.graph.addEdge(line._from, line._to, { weight: 1 })
      })

      /*
        {
    "_key": "01a159633de454e24e4517f9ab09f07bd74eb7e6",
    "_id": "local_binfile/01a159633de454e24e4517f9ab09f07bd74eb7e6",
    "_rev": "_e8U0HrK--A",
    "recipe_srcpkg": "curl@7.82.0-r0",
    "local_binpkg": "curl-doc@7.82.0-r0:core2_64",
    "path": "/usr/share/man/man3/CURLOPT_INTERLEAVEDATA.3",
    "sha1": "d3c31350d7cd5f7e1b4f4b9f475eb47fb0465675",
    "license": "",
    "label": "curl-doc@7.82.0-r0:core2_64:/usr/share/man/man3/CURLOPT_INTERLEAVEDATA.3"
}
        
       

      const source = line.v
      const target = line.c

      const sname = source.name ? source.name : source.vertex
      const tname = target.name ? target.name : target.vertex

      if (!this.graph.hasNode(source._id))
        this.graph.addNode(source._id, {
          nodeType: "elf",
          label: [source._id.substring(4, 12), sname].filter(s => !!s).join(" - ")
        })

      if (this.filter) {
        var filtered = this.filter.filter(obj => {
          return obj.name == sname
        })

        if (filtered.length > 0) return
      }

      if (!this.graph.hasNode(target._id))
        this.graph.addNode(target._id, {
          nodeType: "elft",
          label: [target._id.substring(4, 12), tname].filter(s => !!s).join(" - ")
        })

      if (
        this.graph.hasNode(source._id) &&
        this.graph.hasNode(target._id) &&
        !this.graph.hasEdge(source._id, target._id)
      )
        this.graph.addEdge(source._id, target._id, { weight: 1 })
 */
      const COLORS = { binary: "#FA5A3D", sourcefile: "#5A75DB" }
      this.graph.forEachNode((node, attributes) =>
        this.graph.setNodeAttribute(node, "color", COLORS[attributes.nodeType])
      )

      const degrees = this.graph.nodes().map(node => this.graph.degree(node))
      const minDegree = Math.min(...degrees)
      const maxDegree = Math.max(...degrees)
      const minSize = 5,
        maxSize = 20
      this.graph.forEachNode(node => {
        const degree = this.graph.degree(node)
        this.graph.setNodeAttribute(
          node,
          "size",
          minSize + ((degree - minDegree) / (maxDegree - minDegree)) * (maxSize - minSize)
        )
      })

      circular.assign(this.graph)
      const settings = forceAtlas2.inferSettings(this.graph)
      forceAtlas2.assign(this.graph, { settings, iterations: 50 })

      const container = document.getElementById("sigma-container")
      new Sigma(this.graph, container, { labelColor: { color: "#888" } })

      this.overlay = false
    }
  }
}
</script>
