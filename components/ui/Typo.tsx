import { TypoProps } from '@/types/common';
import {clsx} from 'clsx';
import { verticalScale } from '@/lib/styling';
import { Text } from 'react-native';

const Typo = ({ size = 16, children, className, style, textProps }: TypoProps) => {
  return (
    <Text
      {...textProps}
      className={clsx('', className)}
      style={[
        {
          fontSize: verticalScale(size),
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default Typo;
