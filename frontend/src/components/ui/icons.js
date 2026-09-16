// Central icon registry. Data files reference icons by name; components resolve
// them through `getIcon`. Explicit imports keep the bundle tree-shakeable.
import {
  AlertCircle, AppWindow, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Boxes, Braces,
  Briefcase, Building2, Calendar, CalendarCheck, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, Clock, Code2, Contact, Copy, Cpu, Database, ExternalLink, Eye,
  Facebook, FileText, Filter, Github, Globe, GraduationCap, Info, Landmark, Layers, LayoutDashboard,
  LifeBuoy, Linkedin, ListChecks, Loader2, Lock, Mail, Map, MapPin, Menu, MessageCircle,
  MessagesSquare, Moon, MousePointerClick, Newspaper, PackageCheck, Paintbrush, PenTool, Phone,
  Plus, Printer, Puzzle, Quote, Receipt, Rocket, Search, Send, ShieldCheck, ShoppingBag, Smartphone,
  Sparkles, Star, Sun, Table2, Tag, Target, TrendingUp, UserSquare, Users, Video, Wallet,
  Workflow, Wrench, X, Zap,
} from 'lucide-react';

export const icons = {
  AlertCircle, AppWindow, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Boxes, Braces,
  Briefcase, Building2, Calendar, CalendarCheck, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, Clock, Code2, Contact, Copy, Cpu, Database, ExternalLink, Eye,
  Facebook, FileText, Filter, Github, Globe, GraduationCap, Info, Landmark, Layers, LayoutDashboard,
  LifeBuoy, Linkedin, ListChecks, Loader2, Lock, Mail, Map, MapPin, Menu, MessageCircle,
  MessagesSquare, Moon, MousePointerClick, Newspaper, PackageCheck, Paintbrush, PenTool, Phone,
  Plus, Printer, Puzzle, Quote, Receipt, Rocket, Search, Send, ShieldCheck, ShoppingBag, Smartphone,
  Sparkles, Star, Sun, Table2, Tag, Target, TrendingUp, UserSquare, Users, Video, Wallet,
  Workflow, Wrench, X, Zap,
};

export const getIcon = (name, fallback = 'Sparkles') => icons[name] || icons[fallback];
export default icons;
