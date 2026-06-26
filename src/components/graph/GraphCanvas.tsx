import React, { useEffect, useState, useMemo } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Post, Section } from "../../types";
import { Link } from "react-router-dom";
import { ArrowRight, Info, Eye, Filter } from "lucide-react";

interface GraphCanvasProps {
  posts: Post[];
  sections: Section[];
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ posts, sections }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [filterSectionId, setFilterSectionId] = useState<string>("all");

  // Determine section styling colors
  const sectionColors = useMemo(() => {
    return {
      "sec-blog": { border: "#6366f1", bg: "#e0e7ff", text: "#4338ca", bgDark: "#1e1b4b" }, // Indigo
      "sec-projects": { border: "#10b981", bg: "#d1fae5", text: "#065f46", bgDark: "#064e3b" }, // Emerald
      "sec-notes": { border: "#f43f5e", bg: "#ffe4e6", text: "#9f1239", bgDark: "#4c0519" }, // Rose
      "sec-ctf": { border: "#0ea5e9", bg: "#e0f2fe", text: "#075985", bgDark: "#0c4a6e" }, // Sky/Blue
      default: { border: "#f59e0b", bg: "#fef3c7", text: "#92400e", bgDark: "#451a03" }, // Amber
    };
  }, []);

  // Filter posts based on slider or section selected
  const activePosts = useMemo(() => {
    const publishedOnly = posts.filter((p) => p.status === "published");
    if (filterSectionId === "all") return publishedOnly;
    return publishedOnly.filter((p) => p.sectionId === filterSectionId);
  }, [posts, filterSectionId]);

  useEffect(() => {
    // Generate clean node layouts radiating out from centers
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const computedNodes: Node[] = [];
    const computedEdges: Edge[] = [];

    // Simple spring/radial force spreading algorithm to prevent layout overlaps
    activePosts.forEach((post, index) => {
      const angle = (index / activePosts.length) * 2 * Math.PI;
      // Radially space them out dynamically based on connections or index
      const radius = 180 + Math.random() * 80 + (index % 2 === 0 ? 30 : -30);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const secConf = (sectionColors as any)[post.sectionId] || sectionColors.default;

      computedNodes.push({
        id: post.id,
        position: { x, y },
        data: {
          label: (
            <div className="text-center select-none font-sans flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">
                {sections.find((s) => s.id === post.sectionId)?.icon} {sections.find((s) => s.id === post.sectionId)?.name}
              </span>
              <strong className="text-xs font-semibold block mt-0.5 max-w-[150px] truncate">
                {post.title}
              </strong>
            </div>
          ),
        },
        type: "default",
        style: {
          border: `2px solid ${secConf.border}`,
          borderRadius: "10px",
          backgroundColor: document.documentElement.classList.contains("dark") ? secConf.bgDark : secConf.bg,
          color: document.documentElement.classList.contains("dark") ? "#fff" : secConf.text,
          boxShadow: "0 4px 12px rbg(0 0 0 / 10%)",
          padding: "6px 12px",
          width: 180,
          cursor: "pointer",
        },
      });

      // Map edges for connections
      if (post.links && Array.isArray(post.links)) {
        post.links.forEach((targetId) => {
          // Verify target post is part of our active visible list
          if (activePosts.some((ap) => ap.id === targetId)) {
            computedEdges.push({
              id: `edge-${post.id}-${targetId}`,
              source: post.id,
              target: targetId,
              animated: true,
              style: { stroke: secConf.border, strokeWidth: 1.5 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 14,
                height: 14,
                color: secConf.border,
              },
            });
          }
        });
      }
    });

    setNodes(computedNodes);
    setEdges(computedEdges);
  }, [activePosts, sections, sectionColors, setNodes, setEdges]);

  // Click handler on nodes
  const onNodeClick = (_e: React.MouseEvent, node: Node) => {
    const post = posts.find((p) => p.id === node.id);
    if (post) {
      setSelectedPost(post);
    }
  };

  return (
    <div className="w-full h-full relative font-sans flex flex-col bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      {/* Controls panel header bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 mr-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold pr-2 border-r border-zinc-200 dark:border-zinc-800">
          <Filter className="h-4 w-4 text-indigo-500" />
          <span>Section View:</span>
        </div>
        <select
          value={filterSectionId}
          onChange={(e) => {
            setFilterSectionId(e.target.value);
            setSelectedPost(null);
          }}
          className="bg-transparent border-0 font-sans text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-0 cursor-pointer"
        >
          <option value="all">🧠 All Notes Map</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* ReactFlow Editor Container */}
      <div className="flex-grow w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#cbd5e1" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Floating Detailed Node Modal on selection */}
      {selectedPost && (
        <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-96 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-slide-up">
          <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-indigo-500">
            {sections.find((s) => s.id === selectedPost.sectionId)?.icon} {sections.find((s) => s.id === selectedPost.sectionId)?.name} Note Connection
          </span>

          <h3 className="text-base font-bold font-sans text-zinc-900 dark:text-white mt-1">
            {selectedPost.title}
          </h3>

          <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
            {selectedPost.excerpt || "No short lead summary configured."}
          </p>

          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-4 pt-3 text-xs">
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <span className="text-[10px] text-zinc-400 italic">
                #{selectedPost.tags[0]}
              </span>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Close
              </button>
              
              <Link
                to={`/${sections.find((s) => s.id === selectedPost.sectionId)?.slug || "blog"}/${selectedPost.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
              >
                <span>Open Post</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
