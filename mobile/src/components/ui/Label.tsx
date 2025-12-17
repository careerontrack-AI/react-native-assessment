import { useThemedStyles } from '../../theme/useThemedStyles';
import React from 'react';
import { Text, TextProps } from 'react-native';


interface LabelProps extends TextProps {
  disabled?: boolean;
}

const Label = React.forwardRef<Text, LabelProps>(
  ({ style, disabled, ...props }, ref) => {
    const styles = useThemedStyles(theme => ({
      base: {
        fontSize: theme.typography.size.md,
        fontWeight: theme.typography.weight.medium,
        fontFamily: theme.typography.font.medium,
        lineHeight: theme.typography.lineHeight.sm,
        color: theme.colors.textPrimary,
      },
      disabled: {
        opacity: 0.7,
      },
    }));

    return (
      <Text
        ref={ref}
        accessibilityLabel={props.children?.toString()}
        style={[
          styles.base,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export default Label;
