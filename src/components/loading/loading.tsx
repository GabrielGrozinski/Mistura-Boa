import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Svg, Path, Rect, Circle } from 'react-native-svg';

const Loader: React.FC = () => {
  const truckAnim = useRef(new Animated.Value(0)).current;
  const roadAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação da suspensão do caminhão
    Animated.loop(
      Animated.sequence([
        Animated.timing(truckAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(truckAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animação da estrada e lamp post
    Animated.loop(
      Animated.timing(roadAnim, {
        toValue: -350,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [truckAnim, roadAnim]);

  const truckTranslate = truckAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  return (
    <View className="justify-center items-center">
      <View className="w-52 h-32 relative items-center justify-end overflow-hidden">
        {/* Truck Body */}
        <Animated.View
          style={{ transform: [{ translateY: truckTranslate }], marginBottom: 6 }}
        >
          <Svg width={130} height={90} viewBox="0 0 198 93" fill="none">
            {/* Caminhão completo */}
            <Path
              d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
              stroke="#282828"
              strokeWidth={3}
              fill="#F83D3D"
            />
            <Path
              d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
              stroke="#282828"
              strokeWidth={3}
              fill="#7D7C7C"
            />
            <Path
              d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
              stroke="#282828"
              strokeWidth={2}
              fill="#282828"
            />
            <Rect x={187} y={63} width={5} height={7} rx={1} fill="#FFFCAB" stroke="#282828" strokeWidth={2} />
            <Rect x={193} y={81} width={4} height={11} rx={1} fill="#282828" stroke="#282828" strokeWidth={2} />
            <Rect x={6.5} y={1.5} width={121} height={90} rx={2.5} fill="#DFDFDF" stroke="#282828" strokeWidth={3} />
            <Rect x={1} y={84} width={6} height={4} rx={2} fill="#DFDFDF" stroke="#282828" strokeWidth={2} />
          </Svg>
        </Animated.View>

        {/* Truck Tires */}
        <View style={{ width: 130, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, paddingLeft: 15, paddingRight: 10 }}>
          <Svg width={24} height={24} viewBox="0 0 30 30">
            <Circle cx={15} cy={15} r={13.5} stroke="#282828" strokeWidth={3} fill="#282828" />
            <Circle cx={15} cy={15} r={7} fill="#DFDFDF" />
          </Svg>
          <Svg width={24} height={24} viewBox="0 0 30 30">
            <Circle cx={15} cy={15} r={13.5} stroke="#282828" strokeWidth={3} fill="#282828" />
            <Circle cx={15} cy={15} r={7} fill="#DFDFDF" />
          </Svg>
        </View>

        {/* Road */}
        <View className="w-full bg-gray-800 rounded overflow-hidden"
        style={{height: 1.5}}>
          {/* Marcas brancas animadas */}
          {[0, 50, 100, 150].map((offset) => (
            <Animated.View
              key={offset}
              style={{
                position: 'absolute',
                left: offset,
                width: 20,
                height: 1.5,
                backgroundColor: 'black',
                transform: [{ translateX: roadAnim }],
              }}
            />
          ))}
        </View>
      </View>
      {/* Caminhão acima da estrada */}
      <Animated.View
        style={{
          transform: [{ translateY: truckTranslate }],
          zIndex: 10,
          marginBottom: 6,
        }}
      >
      {/* SVG do caminhão completo */}
      </Animated.View>
    </View>
  );
};

export default Loader;
