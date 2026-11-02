type IndicatorsProps = {
  /** Currently visible slide index. */
  activeIndex: number;
  /** Total number of slides in the carousel. */
  totalItems: number;
  /** Dot color variant for contrast on light vs dark slides. */
  variant: 'gray' | 'white' | 'blue';
  /** Fired when a dot is clicked; receives the target slide index. */
  onClick: (index: number) => void;
};

type IndicatorButtonProps = {
  /** Inherited variant from parent indicators. */
  variant: IndicatorsProps['variant'];
  /** Activates navigation to this dot's slide. */
  onClick: () => void;
  /** Whether this dot represents the active slide. */
  isActive?: boolean;
  /** Zero-based slide index (for accessibility labels). */
  slideIndex?: number;
};

export type { IndicatorsProps, IndicatorButtonProps };
