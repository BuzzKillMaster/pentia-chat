import {ReactElement, ReactNode, useEffect, useRef} from "react";
import {Animated, Easing} from "react-native";

/**
 * AnimatedView
 *
 * A React component that applies an animation to its children using the Animated API from the react-native module.
 * It currently animates the opacity of the children from 0 to 1 over a duration of 1000 milliseconds.
 *
 * @param {ReactNode} children - The children to animate.
 *
 * @return {ReactElement} - Returns the children wrapped in an AnimatedView component.
 */
export default function AnimatedView({children}: { children: ReactNode}): ReactElement {
    const animation = useRef(new Animated.Value(0)).current

    // TODO: Add the ability to pass in an animation configuration properties.
    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start()
    }, [animation])

    return (
        <Animated.View style={{
            opacity: animation,
            flex: 1,
        }}>
            {children}
        </Animated.View>
    )
}