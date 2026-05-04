// AdSlot: 広告スロットのプレースホルダーコンポーネント
// 現時点では非表示（高さ0）。広告SDK導入時にここを有効化する。
//
// 使用方法:
//   <AdSlot position="top" />          // コンテンツ上部バナー広告
//   <AdSlot position="bottom" />       // ControlPanel直上バナー広告
//   <AdSlot position="interstitial" /> // インタースティシャル広告（将来用）
//
// 広告SDK導入時の実装例（AdMob）:
//   import { AdMob, BannerAdPosition } from '@capacitor-community/admob';
//   useEffect(() => {
//     if (position === 'top' || position === 'bottom') {
//       AdMob.showBanner({ adId: 'ca-app-pub-xxx', position: BannerAdPosition.TOP_CENTER });
//     }
//   }, []);

const AdSlot = ({ position }) => {
    return (
        <div
            data-ad-position={position}
            aria-hidden="true"
            style={{ height: 0, overflow: 'hidden', width: '100%' }}
        />
    );
};

export default AdSlot;
