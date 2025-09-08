--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: AlarmProtocol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AlarmProtocol" AS ENUM (
    'TELL',
    'IP'
);


ALTER TYPE public."AlarmProtocol" OWNER TO postgres;

--
-- Name: AlarmType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AlarmType" AS ENUM (
    'ZONE',
    'USER',
    'SYSTEM'
);


ALTER TYPE public."AlarmType" OWNER TO postgres;

--
-- Name: Confermation; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Confermation" AS ENUM (
    'Confirmed',
    'Unconfirmed'
);


ALTER TYPE public."Confermation" OWNER TO postgres;

--
-- Name: LocationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LocationType" AS ENUM (
    'COUNTRY',
    'STATE',
    'CITY',
    'DISTRICT'
);


ALTER TYPE public."LocationType" OWNER TO postgres;

--
-- Name: PermissionAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PermissionAction" AS ENUM (
    'INDEX',
    'CREATE',
    'UPDATE',
    'DELETE',
    'READ',
    'ASSIGN',
    'REVOKE'
);


ALTER TYPE public."PermissionAction" OWNER TO postgres;

--
-- Name: PriorityLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PriorityLevel" AS ENUM (
    'VERY_HIGH',
    'HIGH',
    'MEDIUM',
    'LOW',
    'VERY_LOW',
    'NONE'
);


ALTER TYPE public."PriorityLevel" OWNER TO postgres;

--
-- Name: ReceiverProtocol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReceiverProtocol" AS ENUM (
    'CONTACT_ID',
    'IP'
);


ALTER TYPE public."ReceiverProtocol" OWNER TO postgres;

--
-- Name: TimeLogOrOut; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TimeLogOrOut" AS ENUM (
    'OFFLINE',
    'ONLINE'
);


ALTER TYPE public."TimeLogOrOut" OWNER TO postgres;

--
-- Name: UserAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserAction" AS ENUM (
    'ARM',
    'DISARM',
    'NONE'
);


ALTER TYPE public."UserAction" OWNER TO postgres;

--
-- Name: UserType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserType" AS ENUM (
    'OWNER',
    'SUPER_ADMIN',
    'ADMIN',
    'USER'
);


ALTER TYPE public."UserType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ActionLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActionLog" (
    old_id integer,
    model text NOT NULL,
    action text NOT NULL,
    note text,
    "userInfo" jsonb,
    "changedFields" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    model_id uuid,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."ActionLog" OWNER TO postgres;

--
-- Name: ActionLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ActionLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ActionLog_id_seq" OWNER TO postgres;

--
-- Name: ActionLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ActionLog_id_seq" OWNED BY public."ActionLog".old_id;


--
-- Name: Alarm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Alarm" (
    old_id integer,
    code integer NOT NULL,
    label text NOT NULL,
    type public."AlarmType" NOT NULL,
    protocol public."AlarmProtocol" NOT NULL,
    description text,
    action public."UserAction" DEFAULT 'NONE'::public."UserAction" NOT NULL,
    "old_panelTypeId" integer,
    "categoryId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "panelTypeId" uuid,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Alarm" OWNER TO postgres;

--
-- Name: AlarmCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AlarmCategory" (
    old_id integer,
    label text NOT NULL,
    code integer NOT NULL,
    "needsApproval" boolean DEFAULT false NOT NULL,
    priority public."PriorityLevel" DEFAULT 'NONE'::public."PriorityLevel" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."AlarmCategory" OWNER TO postgres;

--
-- Name: AlarmCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AlarmCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AlarmCategory_id_seq" OWNER TO postgres;

--
-- Name: AlarmCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AlarmCategory_id_seq" OWNED BY public."AlarmCategory".old_id;


--
-- Name: Alarm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Alarm_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Alarm_id_seq" OWNER TO postgres;

--
-- Name: Alarm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Alarm_id_seq" OWNED BY public."Alarm".old_id;


--
-- Name: AppSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AppSetting" (
    old_id integer,
    key text NOT NULL,
    value text,
    "isVisible" boolean DEFAULT true NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."AppSetting" OWNER TO postgres;

--
-- Name: AppSetting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AppSetting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AppSetting_id_seq" OWNER TO postgres;

--
-- Name: AppSetting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AppSetting_id_seq" OWNED BY public."AppSetting".old_id;


--
-- Name: AuthLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuthLog" (
    old_id integer,
    ip text,
    "loginTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "logoutTime" timestamp(3) without time zone NOT NULL,
    "userId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."AuthLog" OWNER TO postgres;

--
-- Name: AuthLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuthLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuthLog_id_seq" OWNER TO postgres;

--
-- Name: AuthLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuthLog_id_seq" OWNED BY public."AuthLog".old_id;


--
-- Name: Branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Branch" (
    old_id integer,
    name text NOT NULL,
    "old_locationId" integer,
    code integer NOT NULL,
    address text,
    "phoneNumber" text,
    "destinationPhoneNumber" text,
    "imgUrl" text,
    "panelIp" text,
    "panelCode" integer,
    "emergencyCall" text,
    "old_panelTypeId" integer,
    "old_receiverId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "receiverId" uuid,
    "panelTypeId" uuid,
    "mainPartitionId" uuid,
    "locationId" uuid,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Branch" OWNER TO postgres;

--
-- Name: Branch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Branch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Branch_id_seq" OWNER TO postgres;

--
-- Name: Branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Branch_id_seq" OWNED BY public."Branch".old_id;


--
-- Name: Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employee" (
    old_id integer,
    "localId" integer NOT NULL,
    name text NOT NULL,
    "lastName" text NOT NULL,
    "position" text NOT NULL,
    "nationalCode" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "branchId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Employee" OWNER TO postgres;

--
-- Name: Employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Employee_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Employee_id_seq" OWNER TO postgres;

--
-- Name: Employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Employee_id_seq" OWNED BY public."Employee".old_id;


--
-- Name: Equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Equipment" (
    old_id integer,
    name text NOT NULL,
    model text NOT NULL,
    "imgUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "branchId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Equipment" OWNER TO postgres;

--
-- Name: Equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Equipment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Equipment_id_seq" OWNER TO postgres;

--
-- Name: Equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Equipment_id_seq" OWNED BY public."Equipment".old_id;


--
-- Name: Event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Event" (
    "originalZoneId" text,
    "originalPartitionId" text,
    "referenceId" text,
    "time" text NOT NULL,
    date text NOT NULL,
    "originalEmployeeId" text,
    "originalBranchCode" text,
    ip text,
    description text,
    "confermationStatus" public."Confermation",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "alarmId" uuid,
    "branchId" uuid,
    "zoneId" uuid,
    "partitionId" uuid,
    "employeeId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    old_id integer,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone,
    "dedupHash" character(64)
);


ALTER TABLE public."Event" OWNER TO postgres;

--
-- Name: COLUMN "Event"."dedupHash"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Event"."dedupHash" IS 'SHA-256 hex for deduplication (nullable for legacy rows)';


--
-- Name: Location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Location" (
    old_id integer,
    label text NOT NULL,
    "old_parentId" integer,
    type public."LocationType" NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "parentId" uuid,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone,
    sort integer
);


ALTER TABLE public."Location" OWNER TO postgres;

--
-- Name: Location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Location_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Location_id_seq" OWNER TO postgres;

--
-- Name: Location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Location_id_seq" OWNED BY public."Location".old_id;


--
-- Name: Meta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Meta" (
    old_id integer,
    key text NOT NULL,
    "processId" text NOT NULL,
    value text,
    "expiresAt" integer NOT NULL,
    "timeElapsed" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Meta" OWNER TO postgres;

--
-- Name: Meta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Meta_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Meta_id_seq" OWNER TO postgres;

--
-- Name: Meta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Meta_id_seq" OWNED BY public."Meta".old_id;


--
-- Name: PanelType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PanelType" (
    old_id integer,
    name text NOT NULL,
    model text NOT NULL,
    code integer NOT NULL,
    delimiter text NOT NULL,
    "eventFormat" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."PanelType" OWNER TO postgres;

--
-- Name: PanelType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PanelType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PanelType_id_seq" OWNER TO postgres;

--
-- Name: PanelType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PanelType_id_seq" OWNED BY public."PanelType".old_id;


--
-- Name: Partition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Partition" (
    old_id integer,
    label text NOT NULL,
    "localId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "old_branchDefaultId" integer,
    "branchId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "branchDefaultId" uuid,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Partition" OWNER TO postgres;

--
-- Name: Partition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Partition_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Partition_id_seq" OWNER TO postgres;

--
-- Name: Partition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Partition_id_seq" OWNED BY public."Partition".old_id;


--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    action public."PermissionAction" NOT NULL,
    model text NOT NULL,
    field text,
    description text,
    old_id integer,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: PersonalSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PersonalSetting" (
    old_id integer,
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."PersonalSetting" OWNER TO postgres;

--
-- Name: PersonalSetting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PersonalSetting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PersonalSetting_id_seq" OWNER TO postgres;

--
-- Name: PersonalSetting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PersonalSetting_id_seq" OWNED BY public."PersonalSetting".old_id;


--
-- Name: Receiver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Receiver" (
    old_id integer,
    token text NOT NULL,
    model text NOT NULL,
    protocol public."ReceiverProtocol" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Receiver" OWNER TO postgres;

--
-- Name: Receiver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Receiver_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Receiver_id_seq" OWNER TO postgres;

--
-- Name: Receiver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Receiver_id_seq" OWNED BY public."Receiver".old_id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    old_id integer,
    fullname text NOT NULL,
    username text NOT NULL,
    "nationalityCode" text NOT NULL,
    password text NOT NULL,
    type public."UserType" NOT NULL,
    "personalCode" text NOT NULL,
    "avatarUrl" text,
    "fatherName" text NOT NULL,
    "phoneNumber" text NOT NULL,
    address text NOT NULL,
    ip text NOT NULL,
    status public."TimeLogOrOut" DEFAULT 'OFFLINE'::public."TimeLogOrOut",
    "old_locationId" integer,
    "ConfirmationTime" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "locationId" uuid NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserPermission" (
    old_id integer,
    "modelId" integer,
    "userId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "old_permissionId" integer,
    "permissionId" uuid,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."UserPermission" OWNER TO postgres;

--
-- Name: UserPermission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserPermission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserPermission_id_seq" OWNER TO postgres;

--
-- Name: UserPermission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserPermission_id_seq" OWNED BY public."UserPermission".old_id;


--
-- Name: UserSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSetting" (
    old_id integer,
    "alarmColor" text,
    "audioUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "alarmCategoryId" uuid,
    "userId" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."UserSetting" OWNER TO postgres;

--
-- Name: UserSetting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserSetting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserSetting_id_seq" OWNER TO postgres;

--
-- Name: UserSetting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserSetting_id_seq" OWNED BY public."UserSetting".old_id;


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".old_id;


--
-- Name: Zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Zone" (
    old_id integer,
    "localId" integer NOT NULL,
    label text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "zoneTypeId" uuid,
    "partitionId" uuid,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Zone" OWNER TO postgres;

--
-- Name: ZoneType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ZoneType" (
    old_id integer,
    label text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."ZoneType" OWNER TO postgres;

--
-- Name: ZoneType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ZoneType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ZoneType_id_seq" OWNER TO postgres;

--
-- Name: ZoneType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ZoneType_id_seq" OWNED BY public."ZoneType".old_id;


--
-- Name: Zone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Zone_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Zone_id_seq" OWNER TO postgres;

--
-- Name: Zone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Zone_id_seq" OWNED BY public."Zone".old_id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: processed_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.processed_events (
    event_id uuid NOT NULL,
    event_type character varying(255) NOT NULL,
    source character varying(8) NOT NULL,
    processed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.processed_events OWNER TO postgres;

--
-- Name: ActionLog ActionLog_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActionLog"
    ADD CONSTRAINT "ActionLog_new_id_key" UNIQUE (id);


--
-- Name: ActionLog ActionLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActionLog"
    ADD CONSTRAINT "ActionLog_pkey" PRIMARY KEY (id);


--
-- Name: AlarmCategory AlarmCategory_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AlarmCategory"
    ADD CONSTRAINT "AlarmCategory_new_id_key" UNIQUE (id);


--
-- Name: AlarmCategory AlarmCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AlarmCategory"
    ADD CONSTRAINT "AlarmCategory_pkey" PRIMARY KEY (id);


--
-- Name: Alarm Alarm_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alarm"
    ADD CONSTRAINT "Alarm_new_id_key" UNIQUE (id);


--
-- Name: Alarm Alarm_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alarm"
    ADD CONSTRAINT "Alarm_pkey" PRIMARY KEY (id);


--
-- Name: AppSetting AppSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppSetting"
    ADD CONSTRAINT "AppSetting_pkey" PRIMARY KEY (id);


--
-- Name: AuthLog AuthLog_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthLog"
    ADD CONSTRAINT "AuthLog_new_id_key" UNIQUE (id);


--
-- Name: AuthLog AuthLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthLog"
    ADD CONSTRAINT "AuthLog_pkey" PRIMARY KEY (id);


--
-- Name: Branch Branch_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_new_id_key" UNIQUE (id);


--
-- Name: Branch Branch_new_mainPartitionId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_new_mainPartitionId_key" UNIQUE ("mainPartitionId");


--
-- Name: Branch Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);


--
-- Name: Employee Employee_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_new_id_key" UNIQUE (id);


--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- Name: Equipment Equipment_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_new_id_key" UNIQUE (id);


--
-- Name: Equipment Equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_new_id_key" UNIQUE (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Location Location_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_new_id_key" UNIQUE (id);


--
-- Name: Location Location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY (id);


--
-- Name: Meta Meta_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Meta"
    ADD CONSTRAINT "Meta_new_id_key" UNIQUE (id);


--
-- Name: Meta Meta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Meta"
    ADD CONSTRAINT "Meta_pkey" PRIMARY KEY (id);


--
-- Name: PanelType PanelType_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PanelType"
    ADD CONSTRAINT "PanelType_new_id_key" UNIQUE (id);


--
-- Name: PanelType PanelType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PanelType"
    ADD CONSTRAINT "PanelType_pkey" PRIMARY KEY (id);


--
-- Name: Partition Partition_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partition"
    ADD CONSTRAINT "Partition_new_id_key" UNIQUE (id);


--
-- Name: Partition Partition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partition"
    ADD CONSTRAINT "Partition_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_new_id_key" UNIQUE (id);


--
-- Name: Permission Permission_old_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_old_id_key" UNIQUE (old_id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: PersonalSetting PersonalSetting_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonalSetting"
    ADD CONSTRAINT "PersonalSetting_new_id_key" UNIQUE (id);


--
-- Name: PersonalSetting PersonalSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonalSetting"
    ADD CONSTRAINT "PersonalSetting_pkey" PRIMARY KEY (id);


--
-- Name: Receiver Receiver_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receiver"
    ADD CONSTRAINT "Receiver_new_id_key" UNIQUE (id);


--
-- Name: Receiver Receiver_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receiver"
    ADD CONSTRAINT "Receiver_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: UserPermission UserPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_pkey" PRIMARY KEY (id);


--
-- Name: UserSetting UserSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSetting"
    ADD CONSTRAINT "UserSetting_pkey" PRIMARY KEY (id);


--
-- Name: User User_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_new_id_key" UNIQUE (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: ZoneType ZoneType_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ZoneType"
    ADD CONSTRAINT "ZoneType_new_id_key" UNIQUE (id);


--
-- Name: ZoneType ZoneType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ZoneType"
    ADD CONSTRAINT "ZoneType_pkey" PRIMARY KEY (id);


--
-- Name: Zone Zone_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zone"
    ADD CONSTRAINT "Zone_new_id_key" UNIQUE (id);


--
-- Name: Zone Zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zone"
    ADD CONSTRAINT "Zone_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: processed_events processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processed_events
    ADD CONSTRAINT processed_events_pkey PRIMARY KEY (event_id);


--
-- Name: ActionLog_model_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ActionLog_model_idx" ON public."ActionLog" USING btree (model);


--
-- Name: AlarmCategory_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AlarmCategory_code_idx" ON public."AlarmCategory" USING btree (code);


--
-- Name: AlarmCategory_label_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AlarmCategory_label_idx" ON public."AlarmCategory" USING btree (label);


--
-- Name: AlarmCategory_needsApproval_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AlarmCategory_needsApproval_idx" ON public."AlarmCategory" USING btree ("needsApproval");


--
-- Name: Alarm_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Alarm_code_idx" ON public."Alarm" USING btree (code);


--
-- Name: Alarm_code_protocol_action_panelTypeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Alarm_code_protocol_action_panelTypeId_key" ON public."Alarm" USING btree (code, protocol, action, "panelTypeId");


--
-- Name: AppSetting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AppSetting_key_key" ON public."AppSetting" USING btree (key);


--
-- Name: Branch_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Branch_code_idx" ON public."Branch" USING btree (code);


--
-- Name: Branch_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Branch_id_idx" ON public."Branch" USING btree (old_id);


--
-- Name: Branch_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Branch_name_idx" ON public."Branch" USING btree (name);


--
-- Name: Branch_panelIp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Branch_panelIp_idx" ON public."Branch" USING btree ("panelIp");


--
-- Name: Branch_phoneNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Branch_phoneNumber_idx" ON public."Branch" USING btree ("phoneNumber");


--
-- Name: Location_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Location_parentId_idx" ON public."Location" USING btree ("old_parentId");


--
-- Name: Location_parentId_label_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Location_parentId_label_key" ON public."Location" USING btree ("old_parentId", label);


--
-- Name: Meta_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Meta_key_key" ON public."Meta" USING btree (key);


--
-- Name: Meta_processId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Meta_processId_key" ON public."Meta" USING btree ("processId");


--
-- Name: Permission_action_model_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_action_model_idx" ON public."Permission" USING btree (action, model);


--
-- Name: Permission_action_model_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_action_model_key" ON public."Permission" USING btree (action, model);


--
-- Name: Receiver_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Receiver_token_idx" ON public."Receiver" USING btree (token);


--
-- Name: Receiver_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Receiver_token_key" ON public."Receiver" USING btree (token);


--
-- Name: User_locationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_locationId_idx" ON public."User" USING btree ("old_locationId");


--
-- Name: event_dedup_hash_uq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX event_dedup_hash_uq ON public."Event" USING btree ("dedupHash") WHERE ("dedupHash" IS NOT NULL);


--
-- Name: idx_processed_events_type_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_processed_events_type_time ON public.processed_events USING btree (event_type, processed_at);


--
-- Name: uniq_alarmcategory_code_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_alarmcategory_code_active ON public."AlarmCategory" USING btree (code) WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_alarmcategory_label_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_alarmcategory_label_active ON public."AlarmCategory" USING btree (label) WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_branch_code_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_branch_code_active ON public."Branch" USING btree (code) WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_branch_panelcode_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_branch_panelcode_active ON public."Branch" USING btree ("panelCode") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_branch_panelip_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_branch_panelip_active ON public."Branch" USING btree ("panelIp") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_branch_phone_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_branch_phone_active ON public."Branch" USING btree ("phoneNumber") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_employee_branch_local_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_employee_branch_local_active ON public."Employee" USING btree ("branchId", "localId") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_paneltype_code_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_paneltype_code_active ON public."PanelType" USING btree (code) WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_partition_branchDefault_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "uniq_partition_branchDefault_active" ON public."Partition" USING btree ("branchDefaultId") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_partition_branch_local_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_partition_branch_local_active ON public."Partition" USING btree ("branchId", "localId") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_personalsetting_user_key_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_personalsetting_user_key_active ON public."PersonalSetting" USING btree ("userId", key) WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_user_nationality_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_user_nationality_active ON public."User" USING btree ("nationalityCode") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_user_username_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_user_username_active ON public."User" USING btree (username) WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_usersetting_user_alarm_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_usersetting_user_alarm_active ON public."UserSetting" USING btree ("userId", "alarmCategoryId") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_zone_partition_local_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_zone_partition_local_active ON public."Zone" USING btree ("partitionId", "localId") WHERE ("deletedAt" IS NULL);


--
-- Name: uniq_zonetype_label_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_zonetype_label_active ON public."ZoneType" USING btree (label) WHERE ("deletedAt" IS NULL);


--
-- Name: ActionLog ActionLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActionLog"
    ADD CONSTRAINT "ActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Alarm Alarm_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alarm"
    ADD CONSTRAINT "Alarm_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."AlarmCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Alarm Alarm_panelTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alarm"
    ADD CONSTRAINT "Alarm_panelTypeId_fkey" FOREIGN KEY ("panelTypeId") REFERENCES public."PanelType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AuthLog AuthLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthLog"
    ADD CONSTRAINT "AuthLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Branch Branch_locationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES public."Location"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Branch Branch_mainPartitionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_mainPartitionId_fkey" FOREIGN KEY ("mainPartitionId") REFERENCES public."Partition"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Branch Branch_panelTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_panelTypeId_fkey" FOREIGN KEY ("panelTypeId") REFERENCES public."PanelType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Branch Branch_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."Receiver"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Employee Employee_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Equipment Equipment_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Event Event_alarmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES public."Alarm"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Event Event_partitionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_partitionId_fkey" FOREIGN KEY ("partitionId") REFERENCES public."Partition"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Event Event_zoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES public."Zone"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Location Location_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Location"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Partition Partition_branchDefaultId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partition"
    ADD CONSTRAINT "Partition_branchDefaultId_fkey" FOREIGN KEY ("branchDefaultId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Partition Partition_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partition"
    ADD CONSTRAINT "Partition_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PersonalSetting PersonalSetting_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonalSetting"
    ADD CONSTRAINT "PersonalSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserPermission UserPermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserPermission UserPermission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSetting UserSetting_alarmCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSetting"
    ADD CONSTRAINT "UserSetting_alarmCategoryId_fkey" FOREIGN KEY ("alarmCategoryId") REFERENCES public."AlarmCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSetting UserSetting_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSetting"
    ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_locationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES public."Location"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Zone Zone_partitionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zone"
    ADD CONSTRAINT "Zone_partitionId_fkey" FOREIGN KEY ("partitionId") REFERENCES public."Partition"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Zone Zone_zoneTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zone"
    ADD CONSTRAINT "Zone_zoneTypeId_fkey" FOREIGN KEY ("zoneTypeId") REFERENCES public."ZoneType"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

