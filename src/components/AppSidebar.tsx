import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import {
  Calendar,
  LayoutDashboard,
  CalendarDays,
  Plus,
  Heart,
  Bell,
  MessageSquare,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isAdmin?: boolean;
  onLogout?: () => void;
  user?: any;
}

export function AppSidebar({ currentPage, onPageChange, isAdmin = false, onLogout, user }: AppSidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", value: "dashboard" },
    { icon: Calendar, label: "Calendar", value: "calendar" },
    { icon: CalendarDays, label: "Events", value: "events" },
    { icon: Plus, label: "Create Event", value: "create-event" },
    { icon: Heart, label: "Volunteers", value: "volunteers" },
    { icon: Bell, label: "Announcements", value: "announcements" },
    { icon: MessageSquare, label: "Forum", value: "forum" },
    { icon: User, label: "Profile", value: "profile" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-orange-700">Samudaya</h3>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.value)}
                    isActive={currentPage === item.value}
                    className={currentPage === item.value ? "bg-orange-100 text-orange-700" : ""}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="hover:bg-destructive/10 hover:text-destructive"
              onClick={onLogout}
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-600 text-white">
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                </div>
                <LogOut className="h-4 w-4" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}