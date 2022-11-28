import { StyleSheet } from 'react-native';

/**
 * Global shorthand styles
 *
 * Usage: `C.f1` or chain `C.flex.row`
 */
const C = StyleSheet.create({
    f1: {
        flex: 1,
    },
    h100: {
        height: '100%',
    },
    z9: {
        zIndex: 9,
    },
    fs12: {
        fontSize: 12,
    },
    hidden: {
        display: 'none',
    },
});
const flex = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
const margin = StyleSheet.create({
    l4: {
        marginLeft: 4,
    },
    t4: {
        marginTop: 4,
    },
});
const text = StyleSheet.create({
    C: {
        textAlign: 'center',
    },
    R: {
        textAlign: 'right',
    },
});

C.flex = flex;
C.margin = margin;
C.text = text;

export default C;
