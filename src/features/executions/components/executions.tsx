"use client"
import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItems,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";

import { useExecutionsParams } from "../hooks/use-executions-params";
import type { Execution } from "@/generated/prisma/client";
import {ExecutionStatus} from "@/generated/prisma/enums"
import { useSuspenseExecutions } from "../hooks/use-executions";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

export const ExecutionList = () => {
  const executions = useSuspenseExecutions();
  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionsItems data={execution} />}
      emptyView={<ExecutionsEmptyView />}
    />
  );
};
export const ExecutionsHeader = () => {
  
  return (
    <>
      <EntityHeader
        title="Executions" 
        description="View your workflow execution history"
      />
    </>
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();
  return (
    <EntityPagination
      page={executions.data.page}
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      onPageChange={(page) => {
        setParams({ ...params, page });
      }}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading Executions..." />;
};
export const ExecutionsError = () => {
  return <ErrorView message="Error loading executions" />;
};

export const ExecutionsEmptyView = () => {
  return (
      <EmptyView
        message="You haven't created any Executions yet. Get Started by running your first workflow"
      />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600 "/>
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin"/>
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600 " />
    default:
      return <ClockIcon className="size-5 text-muted-foreground"/>
  }
}
const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0)+status.slice(1).toLocaleLowerCase()
}
export const ExecutionsItems = ({ data }: {
  data: Execution & {
    workflow: {
      id: string,
      name:string
    }
  }
}) => {
  const duration = data.completedAt
    ? Math.round((new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000) : null
  const subtitle = <>{data.workflow.name} &bull; Started{" "}
    {formatDistanceToNow(data.startedAt, { addSuffix: true })}    
    {duration !== null && <>&bull; Took {duration}s</>}
  </>;  
  return (
    <EntityItems
      href={`/executions/${data.id}`}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className="flex items-center justify-center size-8">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
