import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import PillarXLogo from '../PillarXLogo';

describe('<PillarXLogo />', () => {
    const src = 'https://example.com/logo.png';
  
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(
          <>
            <PillarXLogo src={src} />
            <PillarXLogo src={src} className="custom-class" />
          </>
        )
        .toJSON();
  
      expect(tree).toMatchSnapshot();
    });
  
    it('renders the image with the correct src', () => {
      const tree = renderer.create(<PillarXLogo src={src} />).toJSON() as ReactTestRendererJSON;
      expect(tree.type).toBe('img');
      expect(tree.props.src).toBe(src);
    });
  
    it('applies the default class', () => {
      const tree = renderer.create(<PillarXLogo src={src} />).toJSON() as ReactTestRendererJSON;
      expect(tree.props.className).toContain('w-min');
    });
  
    it('applies the custom class', () => {
      const customClass = 'custom-class';
      const tree = renderer.create(<PillarXLogo src={src} className={customClass} />).toJSON() as ReactTestRendererJSON;
      expect(tree.props.className).toContain('w-min');
      expect(tree.props.className).toContain(customClass);
    });
  });
  