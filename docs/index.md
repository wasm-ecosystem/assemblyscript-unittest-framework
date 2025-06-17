---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "assemblyscript unittest framework"
  tagline: "everything you need for assemblyscript unit test"
  actions:
    - theme: brand
      text: Quick Start
      link: /quick-start
    - theme: alt
      text: API documents
      link: /api-documents
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/HerrCai0907.png',
    name: '蔡聪聪<HerrCai0907>',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/HerrCai0907' },
    ]
  },
  {
    avatar: 'https://www.github.com/XMadrid.png',
    name: 'XMadrid',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/XMadrid' },
    ]
  },
  {
    avatar: 'https://www.github.com/JesseCodeBones.png',
    name: 'JesseCodeBones',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/JesseCodeBones' },
    ]
  },
  {
    avatar: 'https://www.github.com/xpirad.png',
    name: 'xpirad',
    title: 'Contributor',
    links: [
      { icon: 'github', link: 'https://github.com/xpirad' },
    ]
  },
]
</script>

## Contributors

<VPTeamMembers size="small" :members />
