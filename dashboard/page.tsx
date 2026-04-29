"use client";

import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/globalStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { complex, payments } from "@/constant/data";
import { Checkbox } from "@/components/ui/checkbox";
import { BellRing, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StackedBarChart from "@/components/ui/stackedbarchart";
import LineChart from "@/components/ui/linechart";
import BarChart from "@/components/ui/barchart";
import dynamic from "next/dynamic";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AuthServices } from "@/app/_services/login-api.services";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const setTitle = useGlobalStore((state) => state.setTitle);
  const router = useRouter();

  useEffect(() => {
    setTitle("Main Dashboard");
  }, [setTitle]);
  const [date, setDate] = useState<any>();
  const [chartFilter, setChartFilter] = useState<"week" | "month" | "year">("week");

  const generateChartData = (filter: "week" | "month" | "year") => {
    const data1: { x: string; y: number }[] = [];
    const data2: { x: string; y: number }[] = [];
    const now = new Date();
    let days = 7;
    let dateFormat = "LLL dd";
    
    if (filter === "month") {
      days = 30;
      dateFormat = "LLL dd";
    } else if (filter === "year") {
      days = 12;
      dateFormat = "LLL yyyy";
    }

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      if (filter === "year") {
        d.setMonth(d.getMonth() - i);
        data1.push({ x: format(d, dateFormat), y: Math.floor(Math.random() * 500) + 50 });
        data2.push({ x: format(d, dateFormat), y: Math.floor(Math.random() * 400) + 30 });
      } else {
        d.setDate(d.getDate() - i);
        data1.push({ x: format(d, dateFormat), y: Math.floor(Math.random() * 500) + 50 });
        data2.push({ x: format(d, dateFormat), y: Math.floor(Math.random() * 400) + 30 });
      }
    }
    return { data1, data2 };
  };

  const { data1: sampleData1, data2: sampleData2 } = generateChartData(chartFilter);

  const chartColor = ["#3F3DFF", "#6ad2ff", "#04cd9a"];

  const series = [
    {
      name: "Sales",
      data: sampleData1,
    },
    {
      name: "Revenue",
      data: sampleData2,
    },
  ];

  const sampleDataBar = Array.from(
    { length: new Date().getFullYear() - 2019 },
    (_, i) => ({
      x: (2019 + i).toString(),
      y: Math.floor(Math.random() * 1000),
    })
  );

  const seriesBar = [
    {
      name: "Sales",
      data: sampleDataBar,
    },
    {
      name: "Revenue",
      data: sampleDataBar,
    },
    {
      name: "Profit",
      data: sampleDataBar,
    },
  ];

  const seriesSimpleBar = [
    {
      name: "Sales",
      data: sampleDataBar,
    },
  ];

  const Status = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <div className="flex gap-3">
            <div>
              <Icon
                icon={"icon-park-solid:check-one"}
                className="text-green-500"
              />
            </div>
            <div>Approved</div>
          </div>
        );
      case "pending":
        return (
          <div className="flex gap-3">
            <div>
              <Icon
                icon={"zondicons:exclamation-solid"}
                className="text-yellow-500"
              />
            </div>
            <div>Pending</div>
          </div>
        );
      case "reject":
        return (
          <div className="flex gap-3">
            <div>
              <Icon icon={"carbon:close-filled"} className="text-red-500" />
            </div>
            <div>Reject</div>
          </div>
        );
      default:
        break;
    }
  };

  const notifications = [
    {
      title: "Your call has been confirmed.",
      description: "1 hour ago",
    },
    {
      title: "You have a new message!",
      description: "1 hour ago",
    },
    {
      title: "Your subscription is expiring soon!",
      description: "2 hours ago",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 2xl:grid-cols-5 sm:grid-cols-2 gap-5 grid-cols-1">
        <div className="bg-card shadow-sm py-3 px-5 rounded-xl cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/data")}>
          <div className="flex w-full items-center gap-5">
            <div className="bg-muted rounded-full w-14 h-14 flex items-center justify-center">
              <Icon icon="mage:chart-fill" className="text-2xl  text-default" />
            </div>
            <div>
              <small className="text-sm text-muted-foreground">Earnings</small>
              <p className="text-2xl font-medium">Rp. 3,500k</p>
              <div className="text-xs mt-2 text-muted-foreground">
                <small className="text-green-400">+ 12%</small> since last month
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card shadow-sm py-3 px-5 rounded-xl">
          <div className="flex w-full items-center gap-5">
            <div className="bg-muted rounded-full w-14 h-14 flex items-center justify-center">
              <Icon icon="fa:dollar" className="text-2xl  text-default" />
            </div>
            <div>
              <small className="text-sm text-muted-foreground">Spent this month</small>
              <p className="text-2xl font-medium">Rp. 2,531k</p>
              <div className="text-xs mt-2 text-muted-foreground">
                <small className="text-red-400">- 23%</small> since last month
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card shadow-sm py-3 px-5 rounded-xl">
          <div className="flex w-full items-center gap-5">
            <div>
              <small className="text-sm text-muted-foreground">Sales</small>
              <p className="text-2xl font-medium">Rp. 1,391k</p>
              <div className="text-xs mt-2 text-muted-foreground">
                <small className="text-green-400">+5%</small> since last month
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card shadow-sm py-3 px-5 rounded-xl cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/data")}>
          <div className="flex w-full items-center gap-5">
            <div className="bg-[#6ad2ff] rounded-full w-14 h-14 flex items-center justify-center">
              <Icon
                icon="la:project-diagram"
                className="text-2xl  text-white"
              />
            </div>
            <div>
              <small className="text-sm text-muted-foreground">Projects coming</small>
              <p className="text-2xl font-medium">18</p>
              <div className="text-xs mt-2 text-muted-foreground">
                <small className="text-muted-foreground">On development</small>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card shadow-sm py-3 px-5 rounded-xl cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/data")}>
          <div className="flex w-full items-center gap-5">
            <div className="bg-[#6ad2ff] rounded-full w-14 h-14 flex items-center justify-center">
              <Icon icon="mdi:deal-outline" className="text-2xl  text-white" />
            </div>
            <div>
              <small className="text-sm text-muted-foreground">Client</small>
              <p className="text-2xl font-medium">30</p>
              <div className="text-xs mt-2 text-muted-foreground">
                <small className="text-green-400">+5</small> since last month
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Revenue Analytics</h1>
              <div className="flex gap-2">
                {["week", "month", "year"].map((filter) => (
                  <Button
                    key={filter}
                    variant={chartFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartFilter(filter as "week" | "month" | "year")}
                    className="capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-muted rounded p-1 w-6 h-6 flex items-center justify-center">
              <Icon icon="mage:chart-fill" className="text-2xl text-default" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-5">
            <div>
              <div className="text-2xl font-bold mt-5">Rp. 3,201k</div>
              <div className="text-sm text-muted-foreground">
                Total spent <small className="text-green-500">+20.3%</small>
              </div>
              <div className="text-green-500 flex items-center gap-2 mt-4">
                <Icon
                  icon="lets-icons:check-fill"
                  className="text-green-500 text-xl"
                />
                On Track
              </div>
            </div>
            <div className="col-span-3">
              <LineChart
                data={[
                  { name: "Sales", data: sampleData1 },
                  { name: "Revenue", data: sampleData2 },
                ]}
                colors={chartColor}
                legend={{ show: false }}
              />
            </div>
          </div>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Weekly Revenue</h1>
            </div>
            <div className="bg-muted rounded p-1 w-6 h-6 flex items-center justify-center">
              <Icon icon="mage:chart-fill" className="text-2xl  text-default" />
            </div>
          </div>
          <div className="mt-10">
            <StackedBarChart
              data={seriesBar}
              colors={chartColor}
              legend={{
                show: false,
              }}
            />
          </div>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-semibold">Check Table</h1>
            </div>
            <div className="bg-muted rounded p-1 w-6 h-6 flex items-center justify-center">
              <Icon
                icon="material-symbols:table-outline"
                className="text-2xl  text-default"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Name</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <div className="flex gap-2">
                      <Checkbox defaultChecked />
                      <div>{d.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{d.progress}%</TableCell>
                  <TableCell>{d.quantity}</TableCell>
                  <TableCell className="">{format(d.date, "LLL")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="bg-card p-5 rounded-xl shadow-sm">
            <div className="flex justify-between text-xs">
              <div className="text-muted-foreground">Daily Traffic</div>
              <div className="text-green-500">+2.45%</div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-semibold">2.579</span>{" "}
              <small className="text-muted-foreground">Visitors</small>
            </div>
            <div>
              <BarChart
                data={seriesSimpleBar}
                colors={["#471dff"]}
                legend={{
                  show: false,
                }}
              />
            </div>
          </div>
          <div className="bg-card p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div className="">Your Bar Chart</div>
              <div className="">
                <Select>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-semibold">2.579</span>{" "}
              <small className="text-muted-foreground">Visitors</small>
            </div>
            <div>
              <BarChart
                data={seriesSimpleBar}
                colors={["#84d9fd"]}
                legend={{
                  show: false,
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complex?.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <div>{d?.name}</div>
                  </TableCell>
                  <TableCell>{Status(d.status)}</TableCell>
                  <TableCell className="">
                    {format(d.date, "EEE, dd, uu")}
                  </TableCell>
                  <TableCell>
                    <Progress value={d.progress} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="bg-card p-5 rounded-xl shadow-sm">
            <div>
              <Icon
                icon={"ic:twotone-fingerprint"}
                className="text-7xl text-default"
              />
            </div>
            <div className="text-xl mt-5 font-semibold">
              <p>Control card security in-app with a tap</p>
            </div>
            <div className="text-sm mt-3 text-muted-foreground">
              Discover our cards benefits, with one tap.
            </div>
            <div className="w-full mt-6">
              <AlertDialog>
                <AlertDialogTrigger className="w-full">
                  <div className="bg-default w-full py-2 text-white rounded-lg">
                    Click Me!
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <Card className="border-0 shadow-none p-0">
            <CardHeader className="p-0">
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-5">
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex p-0 mt-5 justify-between">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-default text-white">Deploy</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <Card className="border-0 shadow-none p-0">
            <CardHeader className="p-0">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                You have 3 unread notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-5">
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <BellRing />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Push Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to device.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="mt-5 pl-2">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex p-0 mt-5 justify-between">
              <Button className="w-full bg-default text-white">
                <Check /> Mark all as read
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <Card className="border-0 shadow-none p-0">
            <CardHeader className="p-0">
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-5">
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex p-0 mt-5 justify-between">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-default text-white">Deploy</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="bg-card p-5 rounded-xl shadow-sm">
          <Card className="border-0 shadow-none p-0">
            <CardHeader className="p-0">
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-5">
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex p-0 mt-5 justify-between">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-default text-white">Deploy</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
