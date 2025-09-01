import "./global.css";

importações: 

import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { getDatabase, ref, get, set, update } from '@react-native-firebase/database';

const senha = await AsyncStorage.getItem('Senha');
const user = await AsyncStorage.getItem('Usuario');

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from "./types";

type Props = NativeStackScreenProps<TiposRotas, "Tela">;


export default function Tela({navigation}: Props)


import { RouteProp } from "@react-navigation/native";
import type { TiposRotas } from "./types";

type props1 = RouteProp<TiposRotas, "Curso">;

type Props = {
    route: props1
};

const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
