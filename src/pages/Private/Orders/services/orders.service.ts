import { loadAbort } from "../../../../helpers/load-abort-axios.helper";
import restauranteApi from "../../../../api/restauranteApi";
import { IOrder } from "../../../../models/orders.model";
import {
  SubjectDescriptionDetail,
  SubjectDispatchDetail,
  SubjectModalDeleteOrder,
  SubjectModalPayOrder,
  SubjectEditOrderDetail,
} from "../helpers/subject-orders.helper";
import { DateFiltePaginationDto } from "../../Common/dto";
import { FilterOrdersDto } from "../dto/filter-orders.dto";
import { SubjectGenerator } from "../../Common/helpers/subject-generator.helper";

interface ModalOrder {
  value: boolean;
  order: IOrder | null;
}

export const statusModalDescriptionDetail = new SubjectDescriptionDetail();
export const statusModalDispatchDetail = new SubjectDispatchDetail();
export const statusModalDeleteOrder = new SubjectModalDeleteOrder();
export const statusModalDiscountOrder = new SubjectModalPayOrder();
export const statusModalPayOrder = new SubjectModalPayOrder();
export const statusModalAddOrder = new SubjectModalPayOrder();

export const statusModalEditOrderDetail = new SubjectEditOrderDetail();
export const statusModalDeleteOrderDetail = new SubjectEditOrderDetail();

export const statusModalStartOrder = new SubjectGenerator<ModalOrder>();

export interface OrdersResponse {
  orders: IOrder[];
  count: number;
}

export const getOrders = async (filterDto: FilterOrdersDto) => {
  const { limit = 10, offset = 0, ...restFilter } = filterDto;

  const { data } = await restauranteApi.get<OrdersResponse>(`orders`, {
    params: {
      ...restFilter,
      offset: limit * offset,
      limit,
    },
  });

  return data;
};

export const getActiveOrders = async (filterDto: DateFiltePaginationDto) => {
  const { period, startDate, endDate, limit = 10, offset = 0 } = filterDto;

  const { data } = await restauranteApi.get<IOrder[]>(`orders/actives`, {
    params: {
      period,
      startDate,
      endDate,
      offset: limit * offset,
      limit,
    },
  });

  return data;
};

export const getOrdersToday = () => {
  const controller = loadAbort();

  return {
    call: restauranteApi.get<IOrder[]>(
      `orders`,

      { signal: controller.signal }
    ),
    controller,
  };
};

export interface FindOrderByDate {
  startDate?: string;
  endDate?: string;
}

export const getOrdersByDate = (find?: FindOrderByDate) => {
  const controller = loadAbort();

  let call;

  if (find) {
    call = restauranteApi.get<IOrder[]>(
      `orders/${find.startDate ? `?startDate=${find.startDate}` : ""}`,
      { signal: controller.signal }
    );
  } else {
    call = restauranteApi.get<IOrder[]>(`orders`, {
      signal: controller.signal,
    });
  }

  return {
    call,
    controller,
  };
};

export const getOrder = async (orderId: string): Promise<IOrder> => {
  const { data } = await restauranteApi.get<IOrder>(`orders/${orderId}`);

  return data;
};

// export const getOrder = (orderId: string) => {

//   const controller = loadAbort();

//   return {
//     call: restauranteApi.get<IOrder>(`orders/${orderId}`,

//       { signal: controller.signal }),
//     controller

//   }

// }
