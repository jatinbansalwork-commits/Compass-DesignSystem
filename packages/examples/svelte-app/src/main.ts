import { mount } from 'svelte';
// Kdesign's plain stylesheet (opacity steps, the Tasa and Inter faces), and
// the classes UnoCSS generates from Kdesign's config and the app's markup.
import '@klearnow/kdesign-svelte/kdesign.css';
import 'virtual:uno.css';
// The page defaults Kdesign leaves to the app: base font, box model.
import './app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
