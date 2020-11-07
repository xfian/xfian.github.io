import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../node_modules/materialize-css/dist/js/materialize.min.js';
import '../styles/style.css';
import 'idb';
import './data/db.js';
import main from './main.js';

document.addEventListener('DOMContentLoaded', main);