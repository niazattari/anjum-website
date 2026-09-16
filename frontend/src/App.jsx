import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdminRoot from '@/admin/AdminRoot';

const Home = lazy(() => import('@/pages/Home'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const WebApps = lazy(() => import('@/pages/WebApps'));
const SourceCode = lazy(() => import('@/pages/SourceCode'));
const WebAppDetail = lazy(() => import('@/pages/WebAppDetail'));
const About = lazy(() => import('@/pages/About'));
const Process = lazy(() => import('@/pages/Process'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Faq = lazy(() => import('@/pages/Faq'));
const Contact = lazy(() => import('@/pages/Contact'));
const StartProject = lazy(() => import('@/pages/StartProject'));
const RequestReceived = lazy(() => import('@/pages/RequestReceived'));
const Legal = lazy(() => import('@/pages/Legal'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  return (
    <Routes>
      {/* Admin lives outside the public layout — its own chrome, its own auth. */}
      <Route path="/admin/*" element={<AdminRoot />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:slug" element={<ProjectDetail />} />
        <Route path="web-apps" element={<WebApps />} />
        <Route path="web-apps/:slug" element={<WebAppDetail />} />
        <Route path="source-code" element={<SourceCode />} />
        <Route path="about" element={<About />} />
        <Route path="process" element={<Process />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        <Route path="start-project" element={<StartProject />} />
        <Route path="request-received" element={<RequestReceived />} />
        <Route path="privacy" element={<Legal kind="privacy" />} />
        <Route path="terms" element={<Legal kind="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
