"use client"
import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItems,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Credential } from "@/generated/prisma/client";
import {CredentialType} from "@/generated/prisma/enums"
import { useRouter } from "next/navigation";
import Image from "next/image";

export const CredentialSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();
  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialsItems data={credential} />}
      emptyView={<CredentialsEmptyView />}
    />
  );
};
export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  
  return (
    <>
      <EntityHeader
        title="Credentials" 
        description="Create and manage credentials"
        newButtonLabel="New Credential"
        newButtonHref="/credentials/new"
        disabled={disabled}
      />
    </>
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();
  return (
    <EntityPagination
      page={credentials.data.page}
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      onPageChange={(page) => {
        setParams({ ...params, page });
      }}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading Credentials..." />;
};
export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials" />;
};

export const CredentialsEmptyView = () => {
    const router=useRouter()
  const handleCreate = () => {
    router.push("/credentials/new")
  };
  return (
      <EmptyView
        message="You haven't created any Credentials yet. Get Started by creating your first Credential"
        onNew={handleCreate}
      />
  );
};

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/logos/openai.svg",
    [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
    [CredentialType.GEMINI]:"/logos/gemini.svg"
}

export const CredentialsItems = ({ data }: { data: Credential }) => {
  const removeCredential=useRemoveCredential()
  const handleRemove=()=>{
    removeCredential.mutate({ id: data.id });
    }
    const logo=credentialLogos[data.type]||"/logos/openai.svg"
  return (
    <EntityItems
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex items-center justify-center size-8">
              <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
