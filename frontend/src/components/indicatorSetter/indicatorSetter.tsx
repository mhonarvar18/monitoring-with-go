import { Spinner, Dots, Bounce } from 'react-activity';
import 'react-activity/dist/library.css';

export type IndicatorTypes = 'spinner' | 'dots' | 'bounce';

interface Props {
  size?: number;
  color?: string | 'brand' | 'parent';
  className?: string;
  type?: IndicatorTypes;
}

const indicatorSetter: Record<IndicatorTypes, React.ElementType> = {
  spinner: Spinner,
  dots: Dots,
  bounce: Bounce
};

const Indicator: React.FC<Props> = ({
  size = 24,
  color = 'brand',
  type = 'spinner',
  className = ''
}) => {
  const SelectedIndicator = indicatorSetter[type];

  return (
    <div className={`flex justify-center items-center select-none ${className}`}>
      <SelectedIndicator size={size} color={color} />
    </div>
  );
};

export default Indicator;
