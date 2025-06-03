// types
import { ApiLayout } from '../../../types/api';

// components
import AdvertTile from '../components/AdvertTile/AdvertTile';
import EditorialTile from '../components/EditorialTile/EditorialTile';
import GenericBannerTile from '../components/GenericBannerTile/GenericBannerTile';
import HighlightedMediaGridTile from '../components/HighlightedMediaGridTile/HighlightedMediaGridTile';
import PointsTile from '../components/PointsTile/PointsTile';
import TokensHorizontalTile from '../components/TokensHorizontalTile/TokensHorizontalTile';
import TokensVerticalTile from '../components/TokensVerticalTile/TokensVerticalTile';
import TokensWithMarketDataTile from '../components/TokensWithMarketDataTile/TokensWithMarketDataTile';

type TileComponentType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in ApiLayout]: React.FC<any>;
};
export const componentMap: TileComponentType = {
  [ApiLayout.TOKENS_HORIZONTAL]: TokensHorizontalTile,
  [ApiLayout.TOKENS_VERTICAL]: TokensVerticalTile,
  [ApiLayout.GENERIC_BANNER]: GenericBannerTile,
  [ApiLayout.EDITORIAL]: EditorialTile,
  [ApiLayout.AD]: AdvertTile,
  [ApiLayout.MEDIA_GRID_HIGHLIGHTED]: HighlightedMediaGridTile,
  [ApiLayout.PXPOINTS]: PointsTile,
  [ApiLayout.TOKENS_WITH_MARKET_DATA]: TokensWithMarketDataTile,
};
