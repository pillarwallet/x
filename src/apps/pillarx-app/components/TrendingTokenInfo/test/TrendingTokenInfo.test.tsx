import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// images
import defaultLogo from '../../../images/logo-unknown.png';

// components
import TrendingTokenInfo from '../TrendingTokenInfo';

describe('<TrendingTokenInfo />', () => {
    const logo = 'https://example.com/logo.png';
    const tokenName = 'Token Name';
    const tokenValue = 1000;
    const percentage = 5.45;
  
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(<TrendingTokenInfo logo={logo} tokenName={tokenName} tokenValue={tokenValue} percentage={percentage} />)
        .toJSON();
  
      expect(tree).toMatchSnapshot();
    });
  
    it('renders the logo with the correct src', () => {
      const tree = renderer.create(<TrendingTokenInfo logo={logo} tokenName={tokenName} tokenValue={tokenValue} percentage={percentage} />).toJSON() as ReactTestRendererJSON;
      const logoProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'img') as ReactTestRendererJSON) || null;
  
      expect(logoProp).not.toBeNull();
      expect(logoProp.type).toBe('img');
      expect(logoProp.props.src).toBe(logo);
    });

    it('renders the default logo when logo is not provided', () => {
      const tree = renderer.create(<TrendingTokenInfo tokenName={tokenName} tokenValue={tokenValue} percentage={percentage} />).toJSON() as ReactTestRendererJSON;
      const logoProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'img') as ReactTestRendererJSON) || null;
  
      expect(logoProp).not.toBeNull();
      expect(logoProp.type).toBe('img');
      expect(logoProp.props.src).toBe(defaultLogo);
    });
  
    it('renders the token name correctly', () => {
      const tree = renderer.create(<TrendingTokenInfo logo={logo} tokenName={tokenName} tokenValue={tokenValue} percentage={percentage} />).toJSON() as ReactTestRendererJSON;
      const tokenNameProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'p') as ReactTestRendererJSON);
  
      expect(tokenNameProp).not.toBeNull();
      expect(tokenNameProp.type).toBe('p');
      expect(tokenNameProp.children).toContain(tokenName);
    });

    it('does not render the token name', () => {
      const tree = renderer.create(<TrendingTokenInfo logo={logo} tokenValue={tokenValue} percentage={percentage} />).toJSON() as ReactTestRendererJSON;
      const tokenNameProp = (tree.children?.find(child => 
        typeof child === 'object' && child.type === 'p') as ReactTestRendererJSON);

      expect(tokenNameProp.children).not.toContain(tokenName);
    });

    it('renders the token value correctly', () => {
        const tree = renderer.create(<TrendingTokenInfo logo={logo} tokenName={tokenName} tokenValue={tokenValue} percentage={percentage} />).toJSON() as ReactTestRendererJSON;
        
        const tokenValueProp = (tree.children?.filter(child => 
          typeof child === 'object' && child.type === 'p')[1] as ReactTestRendererJSON);
    
        expect(tokenValueProp).not.toBeNull();
        expect(tokenValueProp.type).toBe('p');
        expect(tokenValueProp.children).toContain(tokenValue.toFixed(4));
      });

      it('does not render the token value', () => {
        const tree = renderer.create(<TrendingTokenInfo logo={logo} tokenName={tokenName} percentage={percentage} />).toJSON() as ReactTestRendererJSON;
        
        const tokenValueProp = (tree.children?.find(child => 
          typeof child === 'object' && child.type === 'p') as ReactTestRendererJSON);
    
        expect(tokenValueProp.children).not.toContain(tokenValue.toFixed(4));
      });
  
    it('applies the correct style', () => {
      const tree = renderer.create(<TrendingTokenInfo logo={logo} tokenName={tokenName} tokenValue={tokenValue} percentage={percentage} />).toJSON() as ReactTestRendererJSON;
      expect(tree.type).toBe('div');
      expect(tree.props.className).toContain('flex');
      expect(tree.props.className).toContain('flex-col');
      expect(tree.props.className).toContain('h-auto');
      expect(tree.props.className).toContain('py-5');
    });
  });
