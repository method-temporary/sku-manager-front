import { decorate, observable } from 'mobx';
import { CodeNameModel } from './CodeNameModel';

export class TeamModel {
  company: CodeNameModel = new CodeNameModel();       // 암호화
  team: CodeNameModel = new CodeNameModel();       // 암호화
  leaderId: string = '';        // 상위결재자, 팀장
  leaderName: string = '';

  constructor(teamModel?: TeamModel) {
    if (teamModel) {
      const company = teamModel.company && new CodeNameModel(teamModel.company) || this.company;
      const team = teamModel.team && new CodeNameModel(teamModel.team) || this.team;
      Object.assign(this, { ...TeamModel, company, team });
    }
  }
}

decorate(TeamModel, {
  company: observable,
  team: observable,
});

