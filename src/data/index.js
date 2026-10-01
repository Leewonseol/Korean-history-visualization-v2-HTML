/* 데이터 묶음: 모든 모듈은 이 DATA 객체 하나만 받는다. */
import { PEOPLE, PERSON_STATES } from "./people.js";
import { PLACES } from "./places.js";
import { SOURCES } from "./sources.js";
import { EVENTS, DISCREPANCIES } from "./events.js";

export const DATA = { PEOPLE, PERSON_STATES, PLACES, SOURCES, EVENTS, DISCREPANCIES };
