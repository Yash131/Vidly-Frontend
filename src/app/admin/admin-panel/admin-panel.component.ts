import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { BaseChartDirective, Label } from "ng2-charts";
import { AdminPanelService } from "../service/admin-panel.service";

@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  basicInfos: any;
  isLoading: boolean = false;
  movieArr = [];
  quantityArr = [];

  orderDate = [];
  orderCount = [];
  // bar cart start

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 30,
            fontSize : 5
          },
          gridLines: {
            drawOnChartArea: false
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 50,
            fontSize : 10
          },
          gridLines: {
            drawOnChartArea: false
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = "horizontalBar";
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [];

  // bar chart end

  // line chart start

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
          ticks: {
            min: 0,
            max: 30,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: "March",
          borderColor: "orange",
          borderWidth: 2,

          label: {
            enabled: true,
            fontColor: "orange",
            content: "LineAnno",
          },
        },
      ],
    }
  };
  public lineChartColors: any[] = [];
  public lineChartLegend = true;
  public lineChartType: ChartType = "line";
  public lineChartPlugins = [pluginDataLabels];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  // line chart end

  movieData: any;

  constructor(
    private adminService: AdminPanelService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getBasicInfo();
    this.getOrderPlacedData();
  }

  ngAfterViewInit() {}

  getBasicInfo() {
    this.isLoading = true;
    this.adminService.siteAnalytics().subscribe((res: any) => {
      this.basicInfos = res;
      this.movieData = res?.movieQntyData;
      console.log(this.movieData);
      this.graphdataLoder();
      this.isLoading = false;
    });
  }

  graphdataLoder() {
    if (this.basicInfos) {
      this.isLoading = true;
      this.basicInfos.movieQntyData.forEach((element) => {
        this.movieArr.push(element.title);
        this.quantityArr.push(element.numberInStock);
      });

      this.barChartData = [{ data: this.quantityArr, label: "Quantity" }];
      this.barChartLabels = this.movieArr;

      // console.log(this.barChartData, this.barChartLabels);
      this.isLoading = false;
    }
  }

  getOrderPlacedData() {
    this.isLoading = true;
    this.adminService.orderPlacedGraph().subscribe((res: any) => {
      console.log(res);
      this.linechartdataLoder(res);
      this.isLoading = false;
    });
  }

  linechartdataLoder(res) {
    if (res) {
      this.isLoading = true;
      res.forEach((element) => {
        this.orderDate.push(
          this.datePipe.transform(new Date(element._id), "longDate")
        );
        this.orderCount.push(element.count);
      });

      this.lineChartData = [
        { data: this.orderCount, label: "Orders", fill: false },
      ];
      this.lineChartLabels = this.orderDate;

      console.log(this.lineChartData, this.lineChartLabels);
      this.isLoading = false;
    }
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}

let loadLinechartData = () => {};
