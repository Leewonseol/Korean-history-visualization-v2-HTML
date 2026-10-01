/* 데이터 묶음: 모든 모듈은 이 DATA 객체 하나만 받는다. */
import { PEOPLE, PERSON_ATTESTATIONS } from "./people.js";
import { PLACES } from "./places.js";
import { SOURCES } from "./sources.js";
import { EVENTS, DISCREPANCIES } from "./events.js";
import { COVERAGE } from "./coverage.js";
import { STORY_SCENES } from "./story.js";

export const DATA = { PEOPLE, PERSON_ATTESTATIONS, PLACES, SOURCES, EVENTS, DISCREPANCIES, COVERAGE, STORY_SCENES };
