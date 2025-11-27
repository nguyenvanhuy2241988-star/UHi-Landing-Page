import { Product, Benefit, Certification } from './types';

// Helper to convert Drive view links to direct image links
// Using thumbnail format with size 1000px (w1000) is more reliable for embedding than export=view
const driveImg = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

export const LOGO_URL = driveImg('1FYWHxTjTTeHnQeMvT3FS6A1LvlFMgsU8');

export const PRODUCTS: Product[] = [
  {
    id: 'p2',
    name: 'UHi King Super Sour',
    type: 'Jelly Stick',
    flavor: 'Soda (Ramune)',
    weight: '40g',
    description: 'Vị Soda xanh mát lạnh, sảng khoái. Màu xanh bắt mắt cực hút giới trẻ.',
    color: 'bg-cyan-400',
    textColor: 'text-cyan-900',
    imagePlaceholderColor: '#a0e7e5',
    productImage: driveImg('1H-j90BFNfR4rfpm96puQ7PMASzixuNaF'),
    packagingImage: driveImg('1l1MuHRB2h_nX0Q-7n7hzfN_PESyexMGZ'),
  },
  {
    id: 'p3',
    name: 'UHi King Super Sour',
    type: 'Jelly Stick',
    flavor: 'Cola',
    weight: '40g',
    description: 'Hương vị Cola truyền thống đậm đà, kết hợp lớp đường chua kích thích vị giác.',
    color: 'bg-red-500',
    textColor: 'text-white',
    imagePlaceholderColor: '#b4a7d6',
    productImage: driveImg('1oX2JnELF7qXVlfd8Mgc7R4AsuTbhU9Fz'),
    packagingImage: driveImg('1skUZhxyzRSdMb8A-NxpWC1WRXyznLxil'),
  },
  {
    id: 'p1',
    name: 'UHi King Super Sour',
    type: 'Jelly Stick',
    flavor: 'Peach (Đào)',
    weight: '40g',
    description: 'Kẹo dẻo thanh dài, phủ đường chua cực đã. Vị đào thơm ngọt kết hợp vị chua bùng nổ.',
    color: 'bg-pink-400',
    textColor: 'text-pink-900',
    imagePlaceholderColor: '#ffb7b2',
    productImage: driveImg('15OR3Fietf8We-dZ9yQmw5P__axo6jyNO'),
    packagingImage: driveImg('1DzEoDotzDlbV-IagjUCgZQfkPRx_2nZp'),
  },
  {
    id: 'p4',
    name: 'UHi TwitChui',
    type: 'Twist Jelly Stick',
    flavor: 'Lemon (Chanh)',
    weight: '24g',
    description: 'Thanh xoắn độc đáo có nhân sốt chanh bên trong. Chua ngọt dịu nhẹ, mascot dễ thương.',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-900',
    imagePlaceholderColor: '#fff2cc',
    productImage: driveImg('12r2XWweYpv_LCZldxOZJB-xCkzs-H2_q'),
    packagingImage: driveImg('1OB9FDx_TOs97Qpst4q71kfhb0xZr8dEZ'),
  }
];

export const BENEFITS: Benefit[] = [
  {
    title: 'Chiết Khấu Khủng',
    description: 'Lợi nhuận lên đến 35% - 45% trên giá trị đơn hàng.',
    icon: 'percent'
  },
  {
    title: 'Vốn Khởi Điểm Thấp',
    description: 'Đơn tối thiểu chỉ 20 thùng (~24 triệu VNĐ). Hỗ trợ đơn nhỏ để test thị trường.',
    icon: 'package'
  },
  {
    title: 'Vận Chuyển 0đ',
    description: 'Miễn phí vận chuyển toàn quốc cho mọi đơn hàng đại lý.',
    icon: 'truck'
  },
  {
    title: 'Khuyến Mãi Hot',
    description: 'Mua 10 tặng 1 ngay cho đơn hàng đầu tiên của NPP mới.',
    icon: 'zap'
  }
];

export const CERTIFICATIONS: Certification[] = [
  { 
    name: 'FSSC 22000', 
    description: 'Chứng nhận hệ thống an toàn thực phẩm (Version 5.1)',
    image: driveImg('14orEw5XMoBpL8zfR589jM3b_4DhgR9Sh')
  },
  { 
    name: 'HACCP', 
    description: 'Phân tích mối nguy và điểm kiểm soát tới hạn',
    image: driveImg('1tw17dQCCFrsAAbGvscYYQwium466Bpih')
  },
  { 
    name: 'ISO 22000:2018', 
    description: 'Tiêu chuẩn quốc tế về quản lý an toàn thực phẩm',
    image: driveImg('1tgh_7ha6BMvkbtNC5yLZPXm-YIQ86d7P')
  }
];

export const CONTACT_INFO = {
  company: 'CÔNG TY TNHH LYHU',
  address: 'Tầng 6 V11-B09 KĐT mới An Hưng, phường Dương Nội, TP. Hà Nội',
  hotline: '0969 153 015',
  email: 'lyhu.vn@gmail.com'
};