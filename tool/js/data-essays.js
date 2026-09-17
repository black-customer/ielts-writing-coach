/* data-essays.js — Simon 考官范文精读库（逐句功能标注）
 * role: topic=主题句 explain=解释 example=例子 stance=立场 conclusion=总结 */
const EssayBank = [
  {
    title: "外国游客该不该买贵价门票", type: "opinion",
    question: "Foreign visitors should pay more than local visitors for cultural and historical attractions. To what extent do you agree or disagree with this opinion?",
    stanceNote: "强观点示范：completely disagree，两个主体段全部写反对理由，不写对方",
    paras: [
      { label: "Introduction（2句）", sents: [
        ["It is sometimes argued that tourists from overseas should be charged more than local residents to visit important sites and monuments.", "topic"],
        ["I completely disagree with this idea.", "stance"] ] },
      { label: "Body 1（idea → explain → example）", sents: [
        ["The argument in favour of higher prices for foreign tourists would be that cultural or historical attractions often depend on state subsidies to keep them going, which means that the resident population already pays money to these sites through the tax system.", "explain"],
        ["However, I believe this to be a very shortsighted view.", "stance"],
        ["Foreign tourists contribute to the economy of the host country with the money they spend on a wide range of goods and services, including food, souvenirs, accommodation and travel.", "explain"],
        ["The governments and inhabitants of every country should be happy to subsidise important tourist sites and encourage people from the rest of the world to visit them.", "topic"] ] },
      { label: "Body 2（推演式论证 If...would）", sents: [
        ["If travellers realised that they would have to pay more to visit historical and cultural attractions in a particular nation, they would perhaps decide not to go to that country on holiday.", "explain"],
        ["To take the UK as an example, the tourism industry and many related jobs rely on visitors coming to the country to see places like Windsor Castle or Saint Paul’s Cathedral.", "example"],
        ["These two sites charge the same price regardless of nationality, and this helps to promote the nation’s cultural heritage.", "explain"],
        ["If overseas tourists stopped coming due to higher prices, there would be a risk of insufficient funding for the maintenance of these important buildings.", "explain"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, I believe that every effort should be made to attract tourists from overseas, and it would be counterproductive to make them pay more than local residents.", "conclusion"] ] }
    ]
  },
  {
    title: "动物实验该不该被禁止", type: "discussion",
    question: "Nowadays animal experiments are widely used to develop new medicines and to test the safety of other products. Some people argue that these experiments should be banned because it is morally wrong to cause animals to suffer, while others are in favour of them because of their benefits to humanity. Discuss both views and give your own opinion.",
    stanceNote: "讨论+中间立场示范：支持“有限度的动物实验”，立场在开头/第二主体段/结尾三处出现",
    paras: [
      { label: "Introduction（2句）", sents: [
        ["It is true that medicines and other products are routinely tested on animals before they are cleared for human use.", "topic"],
        ["While I tend towards the viewpoint that animal testing is morally wrong, I would have to support a limited amount of animal experimentation for the development of medicines.", "stance"] ] },
      { label: "Body 1：观点A（5句）", sents: [
        ["On the one hand, there are clear ethical arguments against animal experimentation.", "topic"],
        ["To use a common example of this practice, laboratory mice may be given an illness so that the effectiveness of a new drug can be measured.", "example"],
        ["Opponents of such research argue that humans have no right to subject animals to this kind of trauma, and that the lives of all creatures should be respected.", "explain"],
        ["They believe that the benefits to humans do not justify the suffering caused, and that scientists should use alternative methods of research.", "explain"] ] },
      { label: "Body 2：观点B（我站这边）", sents: [
        ["On the other hand, reliable alternatives to animal experimentation may not always be available.", "topic"],
        ["Supporters of the use of animals in medical research believe that a certain amount of suffering on the part of mice or rats can be justified if human lives are saved.", "explain"],
        ["They argue that opponents of such research might feel differently if a member of their own families needed a medical treatment that had been developed through the use of animal experimentation.", "explain"],
        ["Personally, I agree with the banning of animal testing for non-medical products, but I feel that it may be a necessary evil where new drugs and medical procedures are concerned.", "stance"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, it seems to me that it would be wrong to ban testing on animals for vital medical research until equally effective alternatives have been developed.", "conclusion"] ] }
    ]
  },
  {
    title: "电子游戏利大于弊吗", type: "adv-disadv-opinion",
    question: "Some people regard video games as harmless fun, or even as a useful educational tool. Others, however, believe that videos games are having an adverse effect on the people who play them. In your opinion, do the drawbacks of video games outweigh the benefits?",
    stanceNote: "outweigh 题示范：两边都写，但坏处段更重、立场三处点明",
    paras: [
      { label: "Introduction（2句）", sents: [
        ["Many people, and children in particular, enjoy playing computer games.", "topic"],
        ["While I accept that these games can sometimes have a positive effect on the user, I believe that they are more likely to have a harmful impact.", "stance"] ] },
      { label: "Body 1：好处段", sents: [
        ["On the one hand, video games can be both entertaining and educational.", "topic"],
        ["Users, or gamers, are transported into virtual worlds which are often more exciting and engaging than real-life pastimes.", "explain"],
        ["From an educational perspective, these games encourage imagination and creativity, as well as concentration, logical thinking and problem solving, all of which are useful skills outside the gaming context.", "explain"],
        ["Furthermore, it has been shown that computer simulation games can improve users’ motor skills and help to prepare them for real-world tasks, such as flying a plane.", "example"] ] },
      { label: "Body 2：坏处段（更充分 = outweigh 的暗示）", sents: [
        ["However, I would argue that these benefits are outweighed by the drawbacks.", "stance"],
        ["Gaming can be highly addictive because users are constantly given scores, new targets and frequent rewards to keep them playing.", "explain"],
        ["Many children now spend hours each day trying to progress through the levels of a game or to get a higher score than their friends.", "example"],
        ["This type of addiction can have effects ranging from lack of sleep to problems at school, when homework is sacrificed for a few more hours on the computer or console.", "explain"],
        ["The rise in obesity in recent years has also been linked in part to the sedentary lifestyle and lack of exercise that often accompany gaming addiction.", "explain"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, it seems to me that the potential dangers of video games are more significant than the possible benefits.", "conclusion"] ] }
    ]
  },
  {
    title: "我们为什么需要音乐（双问题题）", type: "two-part",
    question: "There are many different types of music in the world today. Why do we need music? Is the traditional music of a country more important than the international music that is heard everywhere nowadays?",
    stanceNote: "双问题示范：一段答一问，篇幅相当",
    paras: [
      { label: "Introduction（2句，两问都概括回答）", sents: [
        ["It is true that a rich variety of musical styles can be found around the world.", "topic"],
        ["Music is a vital part of all human cultures for a range of reasons, and I would argue that traditional music is more important than modern, international music.", "stance"] ] },
      { label: "Body 1：答第一问（为什么需要音乐）", sents: [
        ["Music is something that accompanies all of us throughout our lives.", "topic"],
        ["As children, we are taught songs by our parents and teachers as a means of learning language, or simply as a form of enjoyment.", "explain"],
        ["Children delight in singing with others, and it would appear that the act of singing in a group creates a connection between participants, regardless of their age.", "explain"],
        ["Later in life, people’s musical preferences develop, and we come to see our favourite songs as part of our life stories.", "explain"],
        ["Music both expresses and arouses emotions in a way that words alone cannot.", "explain"] ] },
      { label: "Body 2：答第二问（传统音乐 vs 国际音乐）", sents: [
        ["In my opinion, traditional music should be valued over the international music that has become so popular.", "stance"],
        ["International pop music is often catchy and fun, but it is essentially a commercial product that is marketed and sold by business people.", "explain"],
        ["Traditional music, by contrast, expresses the culture, customs and history of a country.", "explain"],
        ["Traditional styles, such as..., connect us to the past and form part of our cultural identity.", "example"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, music is a necessary part of human existence, and I believe that traditional music should be given more importance than international music.", "conclusion"] ] }
    ]
  },
  {
    title: "该不该强制青少年做志愿者", type: "opinion",
    question: "Some people think that all teenagers should be required to do unpaid work in their free time to help the local community. They believe this would benefit both the individual teenager and society as a whole. Do you agree or disagree?",
    stanceNote: "完全不同意示范：两段分别反驳“对个人无益”和“对社会无益”，注意题目两个 sub-topic 都回应了",
    paras: [
      { label: "Introduction（2句）", sents: [
        ["Many young people work on a volunteer basis, and this can only be beneficial for both the individual and society as a whole.", "topic"],
        ["However, I do not agree that we should therefore force all teenagers to do unpaid work.", "stance"] ] },
      { label: "Body 1：反驳“对青少年有益”", sents: [
        ["Most young people are already under enough pressure with their studies, without being given the added responsibility of working in their spare time.", "topic"],
        ["School is just as demanding as a full-time job, and teachers expect their students to do homework and exam revision on top of attending lessons every day.", "explain"],
        ["When young people do have some free time, we should encourage them to enjoy it with their friends or to spend it doing sports and other leisure activities.", "explain"],
        ["They have many years of work ahead of them when they finish their studies.", "explain"] ] },
      { label: "Body 2：反驳“对社会有益”", sents: [
        ["At the same time, I do not believe that society has anything to gain from obliging young people to do unpaid work.", "topic"],
        ["In fact, I would argue that it goes against the values of a free and fair society to force a group of people to do something against their will.", "explain"],
        ["Doing this can only lead to resentment amongst young people, who would feel that they were being used, and parents, who would not want to be told how to raise their children.", "explain"],
        ["Currently, nobody is forced to volunteer, and this is surely the best system.", "example"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, teenagers may choose to work for free and help others, but in my opinion we should not make this compulsory.", "conclusion"] ] }
    ]
  },
  {
    title: "老龄化社会的问题与对策", type: "problem-solution",
    question: "In the developed world, average life expectancy is increasing. What problems will this cause for individuals and society? Suggest some measures that could be taken to reduce the impact of ageing populations.",
    stanceNote: "问题解决示范：问题段层层递进、解决段三条措施一条比一条具体",
    paras: [
      { label: "Introduction（2句）", sents: [
        ["It is true that people in industrialised nations can expect to live longer than ever before.", "topic"],
        ["Although there will undoubtedly be some negative consequences of this trend, societies can take steps to mitigate these potential problems.", "stance"] ] },
      { label: "Body 1：问题段（5句，因果链推进）", sents: [
        ["As people live longer and the populations of developed countries grow older, several related problems can be anticipated.", "topic"],
        ["The main issue is that there will obviously be more people of retirement age who will be eligible to receive a pension.", "explain"],
        ["The proportion of younger, working adults will be smaller, and governments will therefore receive less money in taxes in relation to the size of the population.", "explain"],
        ["In other words, an ageing population will mean a greater tax burden for working adults.", "explain"],
        ["Further pressures will include a rise in the demand for healthcare, and the fact young adults will increasingly have to look after their elderly relatives.", "explain"] ] },
      { label: "Body 2：解决段（Firstly/Secondly/Finally）", sents: [
        ["There are several actions that governments could take to solve the problems described above.", "topic"],
        ["Firstly, a simple solution would be to increase the retirement age for working adults, perhaps from 65 to 70.", "explain"],
        ["Nowadays, people of this age tend to be healthy enough to continue a productive working life.", "example"],
        ["A second measure would be for governments to encourage immigration in order to increase the number of working adults who pay taxes.", "explain"],
        ["Finally, money from national budgets will need to be taken from other areas and spent on vital healthcare, accommodation and transport facilities for the rising numbers of older citizens.", "explain"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, various measures can be taken to tackle the problems that are certain to arise as the populations of countries grow older.", "conclusion"] ] }
    ]
  },
  {
    title: "竞争还是合作（讨论题）", type: "discussion",
    question: "Some people think that a sense of competition in children should be encouraged. Others believe that children who are taught to co-operate rather than compete become more useful adults. Discuss both these views and give your own opinion.",
    stanceNote: "讨论题标准结构：两段观点篇幅相当，立场出现在开头/第2主体段/结尾",
    paras: [
      { label: "Introduction（2句）", sents: [
        ["People have different views about whether children should be taught to be competitive or co-operative.", "topic"],
        ["While a spirit of competition can sometimes be useful in life, I believe that the ability to co-operate is more important.", "stance"] ] },
      { label: "Body 1：竞争派（客观陈述）", sents: [
        ["On the one hand, competition can be a great source of motivation for children.", "topic"],
        ["When teachers use games or prizes to introduce an element of competitiveness into lessons, it can encourage children to work harder to outdo the other pupils in the class.", "explain"],
        ["This kind of healthy rivalry may help to build children’s self confidence, while pushing them to work independently and progress more quickly.", "explain"],
        ["When these children leave school, their confidence and determination will help them in competitive situations such as job interviews.", "example"] ] },
      { label: "Body 2：合作派（我站这边）", sents: [
        ["On the other hand, it is perhaps even more important to prepare children for the many aspects of adult life that require co-operation.", "stance"],
        ["In the workplace, adults are expected to work in teams, follow instructions given by their superiors, or supervise and support the more junior members of staff.", "explain"],
        ["Team collaboration skills are much more useful than a competitive determination to win.", "explain"],
        ["This is the attitude that I believe schools should foster in young people.", "stance"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, I can understand why people might want to encourage competitiveness in children, but it seems to me that a co-operative attitude is much more desirable in adult life.", "conclusion"] ] }
    ]
  },
  {
    title: "该不该花钱拯救小语种", type: "discussion",
    question: "Several languages are in danger of extinction because they are spoken by very small numbers of people. Some people say that governments should spend public money on saving these languages, while others believe that would be a waste of money. Discuss both these views and give your opinion.",
    stanceNote: "讨论题：第一段用 Firstly/Secondly，第二段用让步转折，衔接不重复",
    paras: [
      { label: "Introduction（2句）", sents: [
        ["It is true that some minority languages may disappear in the near future.", "topic"],
        ["Although it can be argued that governments could save money by allowing this to happen, I believe that these languages should be protected and preserved.", "stance"] ] },
      { label: "Body 1：浪费钱派（Firstly/Secondly）", sents: [
        ["There are several reasons why saving minority languages could be seen as a waste of money.", "topic"],
        ["Firstly, if a language is only spoken by a small number of people, expensive education programmes will be needed to make sure that more people learn it, and the state will have to pay for facilities, teachers and marketing.", "explain"],
        ["This money might be better spent on other public services.", "explain"],
        ["Secondly, it would be much cheaper and more efficient for countries to have just one language.", "explain"] ] },
      { label: "Body 2：保护派（我站这边，文化认同论证）", sents: [
        ["Despite the above arguments, I believe that governments should try to preserve languages that are less widely spoken.", "stance"],
        ["A language is much more than simply a means of communication; it has a vital connection with the cultural identity of the people who speak it.", "explain"],
        ["If a language disappears, a whole way of life will disappear with it, and we will lose the rich cultural diversity that makes societies more interesting.", "explain"],
        ["By spending money to protect minority languages, governments can also preserve traditions, customs and behaviours that are part of a country’s history.", "explain"] ] },
      { label: "Conclusion（1句）", sents: [
        ["In conclusion, it may save money in the short term if we allow minority languages to disappear, but in the long term this would have an extremely negative impact on our cultural heritage.", "conclusion"] ] }
    ]
  }
];
