// routes.js

import Mixer from './components/Mixer.vue'
import ReviewCards from './components/ReviewCards.vue'

const routes = [
    { path: '/', component: ReviewCards },
    { path: '/mixer', component: Mixer },
];

export default routes;
