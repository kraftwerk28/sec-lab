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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: airports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.airports (
    airport_id integer NOT NULL,
    airport_name character varying(64),
    country character varying(32),
    city character varying(32)
);


ALTER TABLE public.airports OWNER TO postgres;

--
-- Name: airports_airport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.airports_airport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.airports_airport_id_seq OWNER TO postgres;

--
-- Name: airports_airport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.airports_airport_id_seq OWNED BY public.airports.airport_id;


--
-- Name: ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket (
    id_ticket integer NOT NULL,
    from_airp integer,
    to_airp integer,
    price double precision,
    "time" timestamp without time zone,
    seat integer
);


ALTER TABLE public.ticket OWNER TO postgres;

--
-- Name: airports airport_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.airports ALTER COLUMN airport_id SET DEFAULT nextval('public.airports_airport_id_seq'::regclass);


--
-- Data for Name: airports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.airports (airport_id, airport_name, country, city) FROM stdin;
1	Boryspil	Ukraine	Borispol
2	Grand-canaria	Spain	Tenerife
3	Francfurt int	Germany	Francfurt
\.


--
-- Data for Name: ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket (id_ticket, from_airp, to_airp, price, "time", seat) FROM stdin;
1	2	3	12312	2020-01-01 00:00:00	12
2	2	3	12311	2020-01-01 00:00:00	13
3	2	1	44433	2020-01-02 00:00:00	40
4	1	2	23423	2020-01-03 00:00:00	45
\.


--
-- Name: airports_airport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.airports_airport_id_seq', 3, true);


--
-- Name: airports airports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_pkey PRIMARY KEY (airport_id);


--
-- Name: ticket ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_pkey PRIMARY KEY (id_ticket);


--
-- Name: ticket ticket_from_airp_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_from_airp_fkey FOREIGN KEY (from_airp) REFERENCES public.airports(airport_id);


--
-- Name: ticket ticket_to_airp_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_to_airp_fkey FOREIGN KEY (to_airp) REFERENCES public.airports(airport_id);


--
-- PostgreSQL database dump complete
--
