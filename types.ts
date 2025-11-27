export interface Product {
  id: string;
  name: string;
  type: string;
  flavor: string;
  weight: string;
  description: string;
  color: string;
  textColor: string;
  imagePlaceholderColor: string;
  productImage: string;
  packagingImage: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface Certification {
  name: string;
  description: string;
  image: string;
}