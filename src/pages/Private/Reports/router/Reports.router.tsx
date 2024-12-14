
import {lazy} from 'react';
import { RouteObject } from 'react-router-dom';
import { PrivateRoutes } from '../../../../models';
import { IncomesReports } from '../views/IncomesReports/IncomesReports.view';
import { OrdersReports } from '../components/OrdersReports/OrdersReports.component';
import { ReceiptOrderReport } from '../components/OrdersReports/ReceiptOrderReport.component';
import { StaffPlaning } from '../components/StaffPlanning/StaffPlaning.component';
import { ProductsReports } from '../views/ProductsReports/ProductsReports.view';
import { DashboardReports } from '../components';
import { FootFallSimulation } from '../views/FootfallSimulation/FootfallSimulation.view';
import { SimulatorForms } from '../views/SimulatorForms/SimulatorForms.view';
import { FootfallPrediction } from '../views/FootfallPrediction/FootfallPrediction.view';
import { Finances } from '../views/Finances/Finances.view';


const Reports = lazy(() => import('../Reports.page'));



export const ReportsRouter: RouteObject = {


  path: '',
  element: <Reports />,
  children: [
    {
      path: '',
      element: <DashboardReports />
    },
    {
      path: 'prediction/simulation/',
      element: <FootFallSimulation />

    },
    {
      path: 'prediction/simulation/simulator',
      element: <SimulatorForms />

    },
    {
      path: 'prediction',
      element: <FootfallPrediction />
    },
    {
      path: 'staff-planning',
      element: <StaffPlaning />
    },
    {
      path: 'orders',
      element: <OrdersReports />,
    },
    {
      path: 'orders/receipt',
      element: <ReceiptOrderReport />
    },
    {
      path: 'incomes',
      element: <IncomesReports />
    },
    {
      path: 'products',
      element: <ProductsReports />
    },
    {
      path: 'finances',
      element: <Finances />
    }
  ]
}