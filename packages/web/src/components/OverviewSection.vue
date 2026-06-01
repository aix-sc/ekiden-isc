<script setup lang="ts"></script>

<template>
  <section id="overview" class="block">
    <p class="kicker">01 · The idea</p>
    <h2 class="sec-title text-h5 mb-4">QSR re-derives meaning every query. ISC compiles it once.</h2>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card class="pa-4 pole pole-qsr" height="100%">
          <h3>QSR — query-time semantic reconstruction</h3>
          <p>Today's default. Every question makes a frontier model re-read raw passages and rebuild
          the meaning from scratch. Flexible, but the bill is paid <em>on every read</em>.</p>
          <p class="note">cost ∝ read volume</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 pole pole-isc" height="100%">
          <h3>ISC — ingest-time semantic compilation</h3>
          <p>Do the meaning-work once at ingest into a persistent, typed, queryable substrate;
          maintain it incrementally; traverse it cheaply thereafter.</p>
          <p class="note">cost ∝ corpus change, not reads</p>
        </v-card>
      </v-col>
    </v-row>
    <div class="eqbar">
      <span class="eql">break-even read frequency</span>
      <span class="eqf">R* = ( N·c<sub>c</sub> + W·c<sub>m</sub> ) / ( c<sub>q</sub> − c<sub>r</sub> )</span>
      <span class="eqn">Above R* reads, compiling pays off.</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.block { padding: clamp(2.2rem,5vw,3.6rem) 0; border-top: 1px solid var(--line); }
.pole { border-top: 3px solid var(--line); }
.pole h3 { font-family: var(--serif); font-weight: 600; font-size: 1.1rem; margin-bottom: .5rem; }
.pole p { color: var(--soft); font-size: .95rem; }
.pole-qsr { border-top-color: var(--red); h3 { color: var(--red); } }
.pole-isc { border-top-color: var(--teal); h3 { color: var(--teal); } }
.note { font-family: var(--mono); font-size: .8rem; color: var(--mute) !important; margin-top: .7rem; padding-top: .6rem; border-top: 1px dashed var(--line); }
.eqbar { margin-top: 1.2rem; background: var(--navy); color: #fff; border-radius: 12px; padding: 1rem 1.3rem; display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1rem; }
.eql { font-family: var(--mono); font-size: .7rem; text-transform: uppercase; letter-spacing: .1em; color: #9DB8D6; }
.eqf { font-family: var(--mono); font-size: clamp(1rem,2.4vw,1.3rem); font-weight: 700; }
.eqn { font-size: .82rem; color: #C7D6E8; margin-left: auto; }
</style>
