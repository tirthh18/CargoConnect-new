import { useState } from "react";

import Navbar from "../../components/admin/Navbar";
import AgentCard from "../../components/admin/route/AgentCard";
import RouteMap from "../../components/admin/route/RouteMap";
import RoutePanel from "../../components/admin/route/RoutePanel";

import {useGetAgents, useAgentParcels, useUpdateParcelStatus, useOptimizeRoute,} from "../../hooks/useAgent";

export default function FindRoutes() {

  const [selectedAgent, setSelectedAgent] = useState("");

  const {data: agentData, isLoading: loadingAgents, isError: agentError} = useGetAgents();
  const {data: parcelData, isLoading: loadingParcels } = useAgentParcels(selectedAgent);
  const updateMutation = useUpdateParcelStatus();
  const optimizeRoute = useOptimizeRoute(selectedAgent);

  const parcels = parcelData?.parcels || [];
  const agents = agentData?.agents || [];
  const selectedAgentObject = agents.find((agent) => agent._id === selectedAgent) || null;
 
  const optimizedRoute = optimizeRoute.data?.route || parcels;
  const routeDistance = optimizeRoute.data?.distance || 0;
  const estimatedTime = optimizeRoute.data?.estimatedTime || 0;
  const routeGeometry = optimizeRoute.data?.geometry || [];
  const officeCoordinates = optimizeRoute.data?.office || null;


  const handleCalculateRoute = async () => {
    if (!selectedAgent) return;

    await optimizeRoute.refetch();
  };

  const handleUpdateStatus = async (id, status) => {
    await updateMutation.mutateAsync(
      { id, status, agentId: selectedAgent },
      {
        onSuccess: (data) => { console.log("SUCCESS", data);},
        onError: (err) => {console.log("ERROR", err);},
      },
    );
    await optimizeRoute.refetch();
  };

  if (loadingAgents) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />

        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (agentError) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />

        <div className="flex justify-center items-center h-[80vh]">
          <h2 className="text-red-500 text-xl">Failed to load agents</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <main className="px-10 py-10">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#1B1B2F]">Route Finding</h1>

            <p className="text-slate-500 mt-2">
              Optimize delivery routes for your agents
            </p>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
          {agents.map((agent) => (
            <AgentCard
              key={agent._id}
              agent={agent}
              selectedAgent={selectedAgent}
              onSelect={setSelectedAgent}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_480px] gap-8 mt-10 items-start">
          {" "}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-[#1B1B2F]">
                  Live Route Map
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  {selectedAgentObject
                    ? `Showing ${parcels.length} actives parcels for ${selectedAgentObject.name}`
                    : "Select an agent to display parcels"}
                </p>
              </div>
            </div>

            {loadingParcels ? (
              <div className="h-[520px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[#E8734A] border-t-transparent rounded-full animate-spin mx-auto"></div>

                  <p className="mt-4 text-slate-500">Loading Parcels...</p>
                </div>
              </div>
            ) : !selectedAgent ? (
              <div className="h-[520px] flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-700">
                    Select an Agent
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Click an agent card above to display pickup or delivery
                    locations.
                  </p>
                </div>
              </div>
            ) : parcels.length === 0 ? (
              <div className="h-[520px] flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-700">
                    No Parcels Found
                  </h2>

                  <p className="text-slate-500 mt-2">
                    This agent currently has no parcels.
                  </p>
                </div>
              </div>
            ) : (
              <RouteMap
                parcels={parcels}
                optimizedRoute={optimizedRoute}
                routeGeometry={routeGeometry}
                officeCoordinates={optimizeRoute.data?.office}
              />
            )}
          </div>
          <RoutePanel
            selectedAgent={selectedAgentObject}
            parcels={parcels}
            optimizedRoute={optimizedRoute}
            routeDistance={routeDistance}
            estimatedTime={estimatedTime}
            loading={optimizeRoute.isFetching}
            onCalculate={handleCalculateRoute}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </main>
    </div>
  );
}
