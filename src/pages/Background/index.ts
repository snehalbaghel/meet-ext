import store from './services/store';
import { wrapStore } from 'webext-redux';
import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

wrapStore(store);
