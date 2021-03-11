import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/services/order.service";

@Component({
  selector: "app-control-orders",
  templateUrl: "./control-orders.component.html",
  styleUrls: ["./control-orders.component.scss"],
})
export class ControlOrdersComponent implements OnInit {
  orders: any;
  panelOpenState: boolean = false;
  isLoading: boolean = false;
  orderStatus = [
    { status: "Placed", id: "Placed" },
    { status: "Cancelled", id: "Cancelled" },
    { status: "Shipped", id: "Shipped" },
    { status: "Completed", id: "Completed" },
  ];
  selectedStatus;
  constructor(private orderServie: OrderService) {}

  ngOnInit(): void {
    this.get_All_live_orders();
  }

  cancelOrder(order) {
    this.orderServie
      .cancel_order_by_id({ orderID: order?._id })
      .subscribe((res: any) => {
        console.log(res);
        this.get_All_live_orders();
      });
  }

  get_All_live_orders() {
    this.isLoading = true;
    this.orderServie.allLiveOrders().subscribe(
      (res: any) => {
        this.orders = res;
        this.isLoading = false;
      },
      (err: any) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  changeOrderstat(){

  }
}
