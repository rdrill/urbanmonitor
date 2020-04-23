// routes.js

import Mixer from './components/Mixer.vue'
import ReviewCards from './components/ReviewCards.vue'
import MarkdownPage from './components/MarkdownPage.vue'

const routes = [
    { path: '/', component: ReviewCards },
    { path: '/mixer', component: Mixer },
    { path: '/about', component: MarkdownPage },
];

export default routes;
