import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import Tags from '../Tags';

describe('<Tags />', () => {
    const icon = 'https://example.com/icon.png';
    const tagText = 'This is a tag text';
  
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(<Tags icon={icon} tagText={tagText} />)
        .toJSON();
  
      expect(tree).toMatchSnapshot();
    });
  
    it('renders the icon with the correct src', () => {
      const tree = renderer.create(<Tags icon={icon} tagText={tagText} />).toJSON() as ReactTestRendererJSON;
      const iconProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'img') as ReactTestRendererJSON) || null;
  
      expect(iconProp).not.toBeNull();
      expect(iconProp.type).toBe('img');
      expect(iconProp.props.src).toBe(icon);
    });

    it('does not render the icon', () => {
      const tree = renderer.create(<Tags tagText={tagText} />).toJSON() as ReactTestRendererJSON;
      const iconProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'img') as ReactTestRendererJSON) || null;
  
      expect(iconProp).toBeNull();
    });
  
    it('renders the tag text correctly', () => {
      const tree = renderer.create(<Tags icon={icon} tagText={tagText} />).toJSON() as ReactTestRendererJSON;
      const textProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'p') as ReactTestRendererJSON);
  
      expect(textProp).not.toBeNull();
      expect(textProp.type).toBe('p');
      expect(textProp.children).toContain(tagText);
    });

    it('does not render the tag text', () => {
      const tree = renderer.create(<Tags icon={icon} />).toJSON() as ReactTestRendererJSON;
      const textProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'p') as ReactTestRendererJSON);
  
      expect(textProp).toBeUndefined();
    });
  
    it('applies the correct style', () => {
      const tree = renderer.create(<Tags icon={icon} tagText={tagText} />).toJSON() as ReactTestRendererJSON;
      expect(tree.type).toBe('div');
      expect(tree.props.className).toContain('flex');
      expect(tree.props.className).toContain('gap-2');
      expect(tree.props.className).toContain('items-center');
      expect(tree.props.className).toContain('bg-[#312F3A]');
      expect(tree.props.className).toContain('py-1.5');
      expect(tree.props.className).toContain('px-4');
      expect(tree.props.className).toContain('rounded-md');
      expect(tree.props.className).toContain('mobile:px-3');
    });
  });
