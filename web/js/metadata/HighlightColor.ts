/**
 * The set of highlight colors.  We also provide transparent for text you want
 * to index but might not actually want visible in the document. We can use this
 * for secondary / anonymous highlights like notes and comments which might
 * not need to be visibly shown.
 */

export type HighlightColor = NamedColor | RGBColor;

/**
 * Older colors by name
 */
export type NamedColor = 'yellow' | 'red' | 'green' | 'blue' | 'transparent';

/**
 * RGB colors as #FFFFFF or #000000
 */
export type RGBColor = string;

/**
 * An rgba CSS string like rgba(0, 0, 0, 0.5)
 */
export type RGBAStr = string;

export type BackgroundColor = RGBAStr | 'transparent';

/**
 * Alpha channel as [0.0, 1.0]
 */
export type AlphaChannel = number;

export class HighlightColors {

    /**
     * Convert to our standard background color for text highlights.
     *
     */
    public static toBackgroundColor(value: NamedColor | RGBColor | undefined | null,
                                    alpha: AlphaChannel = 0.7): BackgroundColor {

        if (! value) {
            value = 'yellow';
        }

        switch (value) {

            case 'transparent':
                return 'transparent';

            case 'yellow':
                return `rgba(255, 255, 0, ${alpha})`;

            case 'red':
                return `rgba(255, 0, 0, ${alpha})`;

            case 'green':
                return `rgba(0, 255, 0, ${alpha})`;

            case 'blue':
                return `rgba(0, 0, 255, ${alpha})`;

            default:
                return this.toRGBA(value, alpha);

        }

    }

    /**
     * Convert a color like #FFFFFF to rgba
     */
    public static toRGBA(value: RGBColor, alpha: AlphaChannel) {

        const toInt = (str: string) => {
            return parseInt(str, 16);
        };

        const s0 = value.substring(1, 3);
        const s1 = value.substring(3, 5);
        const s2 = value.substring(5, 7);

        const n0 = toInt(s0);
        const n1 = toInt(s1);
        const n2 = toInt(s2);

        return `rgba(${n0}, ${n1}, ${n2}, ${alpha})`;

    }

}
