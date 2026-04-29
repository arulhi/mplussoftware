"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  type: "meeting" | "task" | "reminder" | "event";
  location?: string;
  attendees?: string;
  color: string;
}

const EVENT_COLORS = {
  meeting: "bg-blue-500",
  task: "bg-green-500",
  reminder: "bg-yellow-500",
  event: "bg-purple-500",
};

const EVENT_LABELS = {
  meeting: "Meeting",
  task: "Task",
  reminder: "Reminder",
  event: "Event",
};

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    endTime: "",
    type: "event" as CalendarEvent["type"],
    location: "",
    attendees: "",
  });

  useEffect(() => {
    setMounted(true);
    // Load events from localStorage after mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("calendar_events");
      if (saved) {
        setEvents(JSON.parse(saved));
      } else {
        // Set default events
        setEvents([
          {
            id: "1",
            title: "Team Meeting",
            date: new Date().toISOString().split("T")[0],
            time: "10:00",
            endTime: "11:00",
            type: "meeting" as const,
            location: "Conference Room A",
            attendees: "5 people",
            color: "bg-blue-500",
          },
          {
            id: "2",
            title: "Project Deadline",
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            time: "23:59",
            endTime: "23:59",
            type: "task" as const,
            color: "bg-green-500",
          },
          {
            id: "3",
            title: "Dentist Appointment",
            date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
            time: "14:00",
            endTime: "15:00",
            type: "reminder" as const,
            location: "Dr. Smith Clinic",
            color: "bg-yellow-500",
          },
        ]);
      }
    }
  }, []);

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Statistics
  const getEventStats = () => {
    const now = new Date();
    const thisMonth = events.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const thisWeek = events.filter((e) => {
      const d = new Date(e.date);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return d >= startOfWeek && d <= endOfWeek;
    });
    return {
      total: events.length,
      thisMonth: thisMonth.length,
      thisWeek: thisWeek.length,
      today: events.filter((e) => e.date === formatDate(now)).length,
      byType: {
        meeting: events.filter((e) => e.type === "meeting").length,
        task: events.filter((e) => e.type === "task").length,
        reminder: events.filter((e) => e.type === "reminder").length,
        event: events.filter((e) => e.type === "event").length,
      },
    };
  };

  const stats = getEventStats();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter((event) => event.date === dateStr);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + direction,
        1,
      ),
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (view === "month") {
      setView("day");
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      date: formatDate(selectedDate),
      time: "",
      endTime: "",
      type: "event",
      location: "",
      attendees: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      endTime: event.endTime,
      type: event.type,
      location: event.location || "",
      attendees: event.attendees || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleSaveEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;

    const newEvent: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      endTime: formData.endTime,
      type: formData.type,
      location: formData.location,
      attendees: formData.attendees,
      color: EVENT_COLORS[formData.type],
    };

    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? newEvent : e)));
    } else {
      setEvents([...events, newEvent]);
    }

    setIsDialogOpen(false);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-border p-1" />,
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const dateEvents = getEventsForDate(date);
      const isSelected = formatDate(date) === formatDate(selectedDate);
      const isToday = formatDate(date) === formatDate(new Date());

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-24 border border-border p-1 cursor-pointer hover:bg-muted transition-colors ${
            isSelected ? "bg-primary/10 border-primary" : ""
          } ${isToday ? "bg-blue-50 dark:bg-blue-950" : ""}`}
        >
          <div
            className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dateEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-0.5 rounded truncate text-white ${event.color}`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dateEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dateEvents.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateEvents = getEventsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());

      days.push(
        <div key={i} className="flex-1 min-w-0">
          <div
            className={`text-center p-2 font-medium border-b ${
              isToday ? "text-primary" : ""
            }`}
          >
            {date.toLocaleDateString("en-US", { weekday: "short" })}
            <div className={`text-lg ${isToday ? "text-primary" : ""}`}>
              {date.getDate()}
            </div>
          </div>
          <div className="p-2 space-y-1 min-h-[400px]">
            {dateEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEditEvent(event)}
                className={`p-2 rounded text-sm cursor-pointer hover:opacity-80 text-white ${event.color}`}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs opacity-90">
                  {event.time} - {event.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>,
      );
    }

    return days;
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="space-y-0">
            {hours.map((hour) => (
              <div key={hour} className="flex border-b h-16">
                <div className="w-16 p-2 text-sm text-muted-foreground border-r">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div className="flex-1 relative">
                  {dayEvents
                    .filter(
                      (event) => parseInt(event.time.split(":")[0]) === hour,
                    )
                    .map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleEditEvent(event)}
                        className={`absolute inset-x-1 p-2 rounded text-sm cursor-pointer hover:opacity-80 text-white ${event.color} z-10`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {event.time} - {event.endTime}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Today Events</div>
              <div className="text-2xl font-bold mt-1">{stats.today}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">This Week</div>
              <div className="text-2xl font-bold mt-1">{stats.thisWeek}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">This Month</div>
              <div className="text-2xl font-bold mt-1">{stats.thisMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Events</div>
              <div className="text-2xl font-bold mt-1">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Event Types Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="text-sm font-medium">Event Types:</div>
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded ${EVENT_COLORS[type as keyof typeof EVENT_COLORS]}`}
                  />
                  <span className="text-sm text-muted-foreground capitalize">
                    {type}:{" "}
                    <span className="font-medium text-foreground">{count}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold min-w-[200px] text-center">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(new Date());
                  }}
                >
                  Today
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {(["month", "week", "day"] as const).map((v) => (
                  <Button
                    key={v}
                    variant={view === v ? "default" : "outline"}
                    onClick={() => setView(v)}
                    className="capitalize"
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "month" && (
              <>
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center font-medium text-sm py-2 border-b"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {renderMonthView()}
                </div>
              </>
            )}
            {view === "week" && (
              <div className="grid grid-cols-7 gap-0 border">
                {renderWeekView()}
              </div>
            )}
            {view === "day" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                {renderDayView()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {events
                  .filter((e) => new Date(e.date) >= new Date())
                  .sort(
                    (a, b) =>
                      new Date(a.date + "T" + a.time).getTime() -
                      new Date(b.date + "T" + b.time).getTime(),
                  )
                  .slice(0, 10)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div
                        className={`w-1 self-stretch rounded ${event.color}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.date} {event.time} - {event.endTime}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                          {event.attendees && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {events.filter((e) => new Date(e.date) >= new Date()).length ===
                  0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No upcoming events. Click "Add Event" to create one.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Event Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: CalendarEvent["type"]) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Start Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees (Optional)</Label>
                <Input
                  id="attendees"
                  value={formData.attendees}
                  onChange={(e) =>
                    setFormData({ ...formData, attendees: e.target.value })
                  }
                  placeholder="Enter attendees"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>
                {editingEvent ? "Update" : "Create"} Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
