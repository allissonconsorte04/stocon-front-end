
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { Bar, BarChart, Pie, PieChart, CartesianGrid, XAxis, Tooltip, Legend, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [productValue, setProductValue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [salesValue, setSalesValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para as datas
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchDashboardData = () => {
      let url = "/dashboard/";
      if (startDate && endDate) {
        const startFormatted = format(startDate, "yyyy-MM-dd");
        const endFormatted = format(endDate, "yyyy-MM-dd");
        console.log(startFormatted)
        url = `/dashboard/start_date=${startFormatted}&end_date=${endFormatted}`;
      }

      api
        .get(url)
        .then((response) => {
          const { products, sales } = response.data;

          setProductCount(products.count);
          setProductValue(parseFloat(products.total_value));
          setSalesCount(sales.count);
          setSalesValue(parseFloat(sales.total_value));
        })
        .catch((error) => {
          console.error("Erro ao obter dados do dashboard:", error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  // Dados para os gráficos
  const barChartData = [
    { name: "Produtos", value: productValue },
    { name: "Vendas", value: salesValue },
  ];

  const pieChartData = [
    { name: "Produtos", value: productCount },
    { name: "Vendas", value: salesCount },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Dashboard - Informações do Estoque</h2>

      {/* <div className="my-4"> */}
        {/* DatePickers para Data Inicial e Final */}
        {/* <div className="flex gap-4">
          <div>
            <label>Data Inicial:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Escolha a data inicial</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div> */}

          {/* <div>
            <label>Data Final:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Escolha a data final</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-2 gap-4 my-4">
        {/* KPI Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total de Produtos</CardTitle>
            <CardDescription>{productCount}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de Vendas</CardTitle>
            <CardDescription>{salesCount}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor Total de Produtos</CardTitle>
            <CardDescription>R$ {productValue.toFixed(2)}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor Total de Vendas</CardTitle>
            <CardDescription>R$ {salesValue.toFixed(2)}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Comparação de Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={300} height={200} data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" radius={8}>
                {barChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} // Alterna entre azul e verde
                  />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Proporção de Produtos e Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={300} height={200}>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#8884d8" : "#82ca9d"} // Azul para produtos, verde para vendas
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
