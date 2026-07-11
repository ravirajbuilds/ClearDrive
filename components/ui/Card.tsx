import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Radius, Spacing } from '@/constants/Layout';

interface CardProps extends ViewProps {
  padded?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/** A themed surface container with border and rounded corners. */
export function Card({ padded = true, style, children, ...rest }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: padded ? Spacing.lg : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
