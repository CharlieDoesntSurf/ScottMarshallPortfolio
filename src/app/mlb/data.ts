import { getSupabase } from '../utils/supabase';
import type { Player } from './PositionPlot';

export type Batter = Omit<Player, 'ops'> & {ops:number|null;teamId:string;half:number|null;month:number|null;week:number|null;rosterDate:string;rosterRound:string};
export type PitcherWindow = {era:number|null;ip:string;outs:number;er:number;games:number;starts:number};
export type Pitcher = {id:string;season:number;name:string;teamId:string;team:string;abbr:string;league:string;position:string;color:string;windows:Record<'season'|'half'|'month'|'week',PitcherWindow>};
export type Rates = {avg:number|null;ops:number|null;obp:number|null;slg:number|null;k_pct:number|null;bb_pct:number|null;pa:number};
export type Point = {x:number;game:number;phase:'regular'|'postseason';date:string;gamePk:string;'10'?:Rates;'30'?:Rates;'90'?:Rates;season?:Rates;post?:Rates};
export type TeamSummary = {season:number;teamId:string;team:string;league:string;regularGames:number;postseasonGames:number;rosterBatters:number;lastDate:string};
export type Team = TeamSummary & {points:Point[]};

// Deduplicate in-flight requests and retain successful results for five minutes.
// Failed requests are evicted so Retry really contacts the server.
const cache = new Map<string,{expires:number;promise:Promise<unknown>}>();
const TTL = 5 * 60_000;
function cached<T>(key:string, load:()=>Promise<T>):Promise<T> {
  const existing = cache.get(key);
  if (existing && existing.expires > Date.now()) return existing.promise as Promise<T>;
  const entry = {expires:Date.now()+TTL,promise:Promise.resolve().then(load)};
  cache.set(key,entry);
  if (cache.size > 64) cache.delete(cache.keys().next().value!);
  entry.promise.catch(()=>{if(cache.get(key)===entry)cache.delete(key);});
  return entry.promise;
}
function fail(error:{message:string}|null) {
  if(error) throw new Error(`Could not load MLB data: ${error.message}`);
}
const playerFields='id:player_id,season,name:player_name,team,abbr:team_abbr,position,league,ops,pa:plate_appearances,rate:play_rate,bats,bwar,color';
const batterFields=`${playerFields},teamId:team_id,half:half_ops,month:month_ops,week:week_ops,rosterDate:roster_date,rosterRound:roster_round`;
const pitcherFields='id:player_id,season,name:player_name,teamId:team_id,team,abbr:team_abbr,league,position,color,windows:pitcher_windows(window_name,era,ip:innings_pitched,outs,er:earned_runs,games:appearances,starts)';
const teamFields='season,teamId:team_id,team,league,regularGames:regular_games,postseasonGames:postseason_games,rosterBatters:roster_batters,lastDate:last_date';

// Explicit deterministic pages protect against Supabase's default row limit.
async function seasonRows<T>(table:string, fields:string, season:number):Promise<T[]> {
  const rows:T[]=[];
  for(let start=0;;start+=500){
    const {data,error}=await getSupabase().schema('mlb').from(table).select(fields).eq('season',season).order('player_id').range(start,start+499);
    fail(error);const batch=data as unknown as T[];rows.push(...batch);
    if(batch.length<500)return rows;
  }
}
export const loadQualified=(season:number)=>cached(`qualified:${season}`,()=>seasonRows<Player>('qualified_players',playerFields,season));
export const loadPlayoff=(season:number)=>cached(`playoff:${season}`,async()=>{
  const [batters,raw]=await Promise.all([
    seasonRows<Batter>('playoff_batters',batterFields,season),
    seasonRows<Omit<Pitcher,'windows'>&{windows:(PitcherWindow&{window_name:string})[]}>('playoff_pitchers',pitcherFields,season),
  ]);
  const pitchers=raw.map(p=>({...p,windows:Object.fromEntries(p.windows.map(({window_name,...w})=>[window_name,w])) as Pitcher['windows']}));
  return {batters,pitchers};
});
export const loadTeams=(season:number)=>cached(`teams:${season}`,async()=>{
  const {data,error}=await getSupabase().schema('mlb').from('rolling_teams').select(teamFields).eq('season',season).order('team');
  fail(error);return data as TeamSummary[];
});
export const loadTeam=(season:number,teamId:string)=>cached(`series:${season}:${teamId}`,async()=>{
  const {data,error}=await getSupabase().schema('mlb').rpc('rolling_series',{p_season:season,p_team_id:teamId});
  fail(error);if(!data)throw new Error('No rolling history is available for this team and season.');return data as Team;
});
