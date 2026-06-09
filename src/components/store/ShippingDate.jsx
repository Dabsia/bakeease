import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../lib/api';
import { formatDate } from '../../utils';


const ShippingDate = () => {
     const {
        data: response,
      } = useQuery({
        queryKey: ["date"],
        queryFn: async () => {
          const res = await fetch(`${API_URL}/date`);
          if (!res.ok) {
            throw new Error("Failed to fetch date");
          }
          return res.json();
        },
      });
    
      const date = response?.data || {};
      localStorage.setItem("shippingDate", date.deliveryDate);
  return (
     <div className = 'bg-[#C56E33] fixed z-50 w-full py-2 flex items-center justify-center' >
          {/* <p>{t("hero.badge.newArrival")}</p> */}
          <p className="font-bold text-white" >Next Shipping Date is { date.deliveryDate ? formatDate(date?.deliveryDate) : ''}</p>
        </div>
  )
}

export default ShippingDate