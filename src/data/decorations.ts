export interface DecoMeta {
  itemId: string;
  name: string;
  width: number;
  height: number;
  category: 'floor' | 'wall' | 'table';
  renderType: 'mai' | 'dao' | 'lantern' | 'couplet' | 'table' | 'cake' | 'fruit' | 'painting' | 'firecracker' | 'chrysanthemum';
}

export const DECORATION_CATALOG: { [itemId: string]: DecoMeta } = {
  hoa_mai: {
    itemId: 'hoa_mai',
    name: 'Chậu Mai Vàng',
    width: 80,
    height: 100,
    category: 'floor',
    renderType: 'mai',
  },
  hoa_dao: {
    itemId: 'hoa_dao',
    name: 'Cành Đào Bích',
    width: 80,
    height: 100,
    category: 'floor',
    renderType: 'dao',
  },
  den_long: {
    itemId: 'den_long',
    name: 'Đèn Lồng Đỏ',
    width: 48,
    height: 70,
    category: 'wall',
    renderType: 'lantern',
  },
  cau_doi_do: {
    itemId: 'cau_doi_do',
    name: 'Đôi Câu Đối Đỏ',
    width: 50,
    height: 120,
    category: 'wall',
    renderType: 'couplet',
  },
  banh_chung: {
    itemId: 'banh_chung',
    name: 'Đĩa Bánh Chưng Xanh',
    width: 60,
    height: 50,
    category: 'table',
    renderType: 'cake',
  },
  mam_ngu_qua: {
    itemId: 'mam_ngu_qua',
    name: 'Mâm Ngũ Quả',
    width: 70,
    height: 60,
    category: 'table',
    renderType: 'fruit',
  },
  tranh_dong_ho: {
    itemId: 'tranh_dong_ho',
    name: 'Tranh Đông Hồ',
    width: 80,
    height: 90,
    category: 'wall',
    renderType: 'painting',
  },
  phao_giay: {
    itemId: 'phao_giay',
    name: 'Dây Pháo Giấy',
    width: 40,
    height: 110,
    category: 'wall',
    renderType: 'firecracker',
  },
  chau_cuc_van_tho: {
    itemId: 'chau_cuc_van_tho',
    name: 'Chậu Cúc Vạn Thọ',
    width: 65,
    height: 70,
    category: 'floor',
    renderType: 'chrysanthemum',
  },
};
