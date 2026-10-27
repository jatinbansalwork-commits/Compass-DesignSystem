import { mount } from 'svelte';
// Klear360's plain stylesheet (opacity steps, the Tasa and Inter faces), and
// the classes UnoCSS generates from Klear360's config and the app's markup.
import '@klearnow/klear360-svelte/blade.css';
import 'virtual:uno.css';
// The page defaults Klear360 leaves to the app: base font, box model.
import './app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
