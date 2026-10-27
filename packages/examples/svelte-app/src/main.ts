import { mount } from 'svelte';
// Compass's plain stylesheet (opacity steps, the Tasa and Inter faces), and
// the classes UnoCSS generates from Compass's config and the app's markup.
import '@klearnow/compass-svelte/blade.css';
import 'virtual:uno.css';
// The page defaults Compass leaves to the app: base font, box model.
import './app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
