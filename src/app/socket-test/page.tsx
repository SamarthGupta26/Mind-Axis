"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socketClient";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Socket } from 'socket.io-client';

// Extended socket interface to handle unknown properties  
interface ExtendedSocket extends Socket {
  engine?: {
    transport?: {
      name?: string;
    };
    readyState?: string;
  };
}

interface ConnectionDetails {
  id?: string;
  transport?: string;
  readyState?: string;
  connected?: boolean;
}

interface HealthCheck {
  status?: string;
  socketio?: string;
  transport?: string;
  path?: string;
  error?: Error;
}

export default function SocketTestPage() {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [healthCheck, setHealthCheck] = useState<HealthCheck | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testHealthEndpoint = useCallback(async () => {
    try {
      const response = await fetch('/api/socket-health');
      const data = await response.json();
      setHealthCheck(data);
      addLog(`Health check: ${data.status}`);
    } catch (error) {
      addLog(`Health check failed: ${error}`);
      setHealthCheck({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  }, []);

  const testSocketConnection = () => {
    addLog('Starting Socket.IO connection test...');
    setConnectionState('connecting');
    
    const socket = getSocket();
    
    socket.on('connect', () => {
      setConnectionState('connected');
      setConnectionDetails({
        id: socket.id,
        connected: socket.connected,
        transport: (socket as ExtendedSocket).engine?.transport?.name,
        readyState: (socket as ExtendedSocket).engine?.readyState
      });
      addLog(`✅ Connected with ID: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
      setConnectionState('disconnected');
      addLog(`❌ Disconnected: ${reason}`);
    });

    socket.on('connect_error', (error) => {
      setConnectionState('error');
      addLog(`🔥 Connection error: ${error.message}`);
      console.error('Full error details:', error);
    });

    if (!socket.connected) {
      socket.connect();
    }
  };

  const disconnectSocket = () => {
    const socket = getSocket();
    socket.disconnect();
    setConnectionState('disconnected');
    addLog('Manually disconnected');
  };

  useEffect(() => {
    testHealthEndpoint();
  }, [testHealthEndpoint]);

  const getStatusBadge = () => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";
    switch (connectionState) {
      case 'connected':
        return `${baseClasses} border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'connecting':
        return `${baseClasses} border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'error':
        return `${baseClasses} border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300`;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Socket.IO Connection Test</h1>
        <p className="text-muted-foreground">Debug and test Socket.IO connectivity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Status */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              {connectionState === 'connected' ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              Connection Status
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <span className={getStatusBadge()}>
                {connectionState}
              </span>
            </div>

            {connectionDetails.id && (
              <div className="space-y-2 text-sm">
                <div>Socket ID: <code className="bg-muted px-1 rounded">{connectionDetails.id}</code></div>
                <div>Transport: <code className="bg-muted px-1 rounded">{connectionDetails.transport || 'N/A'}</code></div>
                <div>Ready State: <code className="bg-muted px-1 rounded">{connectionDetails.readyState || 'N/A'}</code></div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={testSocketConnection} size="sm">
                Connect
              </Button>
              <Button onClick={disconnectSocket} variant="outline" size="sm">
                Disconnect
              </Button>
            </div>
          </div>
        </div>

        {/* Health Check */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              {healthCheck?.status === 'ok' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : healthCheck?.error ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              Health Check
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {healthCheck ? (
              <div className="space-y-2 text-sm">
                {healthCheck.error ? (
                  <div className="text-red-600">Error: {healthCheck.error.toString()}</div>
                ) : (
                  <>
                    <div>Status: <code className="bg-muted px-1 rounded">{healthCheck.status}</code></div>
                    <div>Socket.IO: <code className="bg-muted px-1 rounded">{healthCheck.socketio}</code></div>
                    <div>Transport: <code className="bg-muted px-1 rounded">{healthCheck.transport}</code></div>
                    <div>Path: <code className="bg-muted px-1 rounded">{healthCheck.path}</code></div>
                  </>
                )}
              </div>
            ) : (
              <div>Loading...</div>
            )}

            <Button onClick={testHealthEndpoint} size="sm" variant="outline">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Connection Logs */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Connection Logs</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="bg-muted/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          <Button 
            onClick={() => setLogs([])} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Clear Logs
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Troubleshooting Steps</h3>
        </div>
        <div className="p-6 pt-0">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check that the health check shows &ldquo;ok&rdquo; status</li>
            <li>Click &ldquo;Connect&rdquo; to test Socket.IO connection</li>
            <li>Look for connection logs and any error messages</li>
            <li>If connection fails, check browser developer console</li>
            <li>Try disabling browser extensions or VPN</li>
            <li>Refresh the page and try again</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
