
<template>
  <v-card>
    <v-card-title>Graph Explorer: {{ startVertex }}</v-card-title>
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
      edges: {},
      database: "oniro-test1",
      graph: "test",
      startVertex: "curl@7.82.0"
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

    await this.fetchGraph()

    this.graph = new Graph()
    this.draw()
  },
  methods: {
    async fetchGraph() {
      console.log("fetchGraph")
      const graph = this.db.graph("test")

      const graphEdgeCollections = await graph.edgeCollections()
      for (const collection of graphEdgeCollections) {
        const coll = await this.fetchCollection(collection, true)
      }

      const graphVertexCollections = await graph.vertexCollections()
      for (const collection of graphVertexCollections) {
        const coll = await this.fetchCollection(collection)
      }
    },
    show(item) {
      this.startVertex = item.name + "@" + item.version
      this.draw()
    },
    async fetchCollection(collection, edges = false) {
      console.log("fetchCollection")
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
    drawEdges: function(collection, fromtype, totype) {
      this.edges[collection].forEach(line => {
        if (!this.graph.hasNode(line._from))
          this.graph.addNode(line._from, {
            nodeType: fromtype,
            label: line.label
          })

        if (!this.graph.hasNode(line._to))
          this.graph.addNode(line._to, {
            nodeType: totype,
            label: line.label
          })

        if (
          !this.graph.hasEdge(line._id) &&
          this.graph.hasNode(line._from) &&
          this.graph.hasNode(line._to)
        )
          this.graph.addEdge(line._from, line._to, { weight: 1, label: collection })
      })
    },
    draw: function() {
      this.graph.clear()
      this.graph = new Graph()

      // aggregate root
      this.vertexes["local_binfile"].forEach(line => {
        // TODO: Exact match
        // if (!line.local_binpkg.startsWith(this.startVertex)) return
        if (!this.graph.hasNode(line._id))
          this.graph.addNode(line._id, {
            nodeType: "startnode",
            label: line.label
          })
      })

      this.vertexes["local_srcfile"].forEach(line => {
        const type = line.label.indexOf(".patch") == -1 ? "sourcefile" : "patch"

        if (!this.graph.hasNode(line._id))
          this.graph.addNode(line._id, {
            nodeType: type,
            label: line.label
          })
      })

      this.vertexes["upstr_srcfile"].forEach(line => {
        if (!this.graph.hasNode(line._id))
          this.graph.addNode(line._id, {
            nodeType: "upstrfile",
            label: line.label
          })
      })

      this.drawEdges("generated_from", "binary", "sourcefile")
      this.drawEdges("patch_for", "patch", "sourcefile")
      this.drawEdges("patch_applied_to", "patch", "sourcefile")
      this.drawEdges("copy_of", "sourcefile", "upstrfile")
      // this.drawEdges("includes", "sourcefile", "include")

      const COLORS = {
        startnode: "#ff0000",
        binary: "#00c9e5",
        sourcefile: "#4c4d4e",
        upstrfile: "#fcef5e",
        patch: "#ff21b4",
        include: "#fcef5e",
        orphan_sourcefile: "#000000"
      }
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
      forceAtlas2.assign(this.graph, { settings, iterations: 250 })

      const container = document.getElementById("sigma-container")
      let renderer = new Sigma(this.graph, container, {
        labelColor: { color: "#888" },
        renderEdgeLabels: true
      })
      this.overlay = false
    }
  }
}
</script>
