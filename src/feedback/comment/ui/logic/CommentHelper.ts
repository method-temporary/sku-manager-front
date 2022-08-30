import { MemberService } from '../../../../approval';
import { StudentProfileModel } from '../../../../card/student/model/vo/StudentProfileModel';
import { CommentModel } from '../../model/CommentModel';
import CommentService from '../../present/logic/CommentService';

export async function setCommentMemberInfo(
  comments: CommentModel[],
  commentService: CommentService,
  memberService: MemberService
) {
  //
  const { changeCommentsProp } = commentService;

  const ids = comments.map((student) => student.patronKey.keyString);

  const members = await memberService.findMemberByIds(ids);

  const map: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();

  await members.map((member) => {
    map.set(
      member.id,
      new StudentProfileModel({
        id: member.id,
        company: member.companyName,
        department: member.departmentName,
        email: member.email,
        name: member.name,
      })
    );
  });

  await comments.map((student, index) => {
    const profile = map.get(student.patronKey.keyString);

    changeCommentsProp(index, 'displayName', profile ? profile.name?.ko : '');
    changeCommentsProp(index, 'departmentName', profile ? profile.department.ko : '');
    changeCommentsProp(index, 'companyName', profile ? profile.company.ko : '');
    changeCommentsProp(index, 'email', profile ? profile.email : '');
  });

  return map;
}

export async function setCommentMemberInfoForExcel(
  commentsForExcel: CommentModel[],
  commentService: CommentService,
  memberService: MemberService
) {
  //
  const { changeCommentsForExcelProp } = commentService;

  const ids = commentsForExcel.map((student) => student.patronKey.keyString);

  const members = await memberService.findMemberByIdsExcel(ids);

  const map: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();

  await members.map((member) => {
    map.set(
      member.id,
      new StudentProfileModel({
        id: member.id,
        company: member.companyName,
        department: member.departmentName,
        email: member.email,
        name: member.name,
      })
    );
  });

  await commentsForExcel.map((student, index) => {
    const profile = map.get(student.patronKey.keyString);

    changeCommentsForExcelProp(index, 'displayName', profile ? profile.name?.ko : '');
    changeCommentsForExcelProp(index, 'departmentName', profile ? profile.department.ko : '');
    changeCommentsForExcelProp(index, 'companyName', profile ? profile.company.ko : '');
    changeCommentsForExcelProp(index, 'email', profile ? profile.email : '');
  });

  return map;
}
