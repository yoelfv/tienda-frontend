export interface CheckoutFormData {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  note: string;
}

export interface StoreConfig {
  base_message?: string;
  mensaje_base?: string;
}